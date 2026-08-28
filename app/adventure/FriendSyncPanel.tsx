"use client";

import { useEffect, useRef, useState } from "react";
import type { PluginListenerHandle } from "@capacitor/core";
import {
  chunkFriendPacket,
  createFriendPacket,
  FRIEND_CHARACTERISTIC_UUID,
  FRIEND_SERVICE_UUID,
  FriendChunkAssembler,
  type FriendPacket,
  type FriendPhotoNote,
} from "./friendBluetoothProtocol";
import styles from "./friend-sync.module.css";

type BluetoothModule = typeof import("@capgo/capacitor-bluetooth-low-energy");
type BluetoothPlugin = BluetoothModule["BluetoothLowEnergy"];

type FoundFriend = { deviceId: string; name: string; rssi: number };
type Role = "idle" | "host" | "guest";

type Props = {
  nativeApp: boolean;
  island: string;
  islandName: string;
  completed: string[];
  photos: FriendPhotoNote[];
};

function errorText(error: unknown) {
  return error instanceof Error ? error.message : "Bluetooth通信を開始できませんでした";
}

function bluetoothTimestamp() {
  return Date.now();
}

export default function FriendSyncPanel({ nativeApp, island, islandName, completed, photos }: Props) {
  const [role, setRole] = useState<Role>("idle");
  const [busy, setBusy] = useState(false);
  const [displayName, setDisplayName] = useState("旅の仲間");
  const [status, setStatus] = useState(nativeApp ? "役割を選ぶと、近くの友達だけに旅の記録を送れます。" : "Bluetooth友達同期はAndroid／iPhoneのネイティブ版で利用できます。");
  const [found, setFound] = useState<FoundFriend[]>([]);
  const [connected, setConnected] = useState<string[]>([]);
  const [received, setReceived] = useState<FriendPacket[]>([]);
  const pluginRef = useRef<BluetoothPlugin | null>(null);
  const roleRef = useRef<Role>("idle");
  const connectedRef = useRef<string[]>([]);
  const listenerHandles = useRef<PluginListenerHandle[]>([]);
  const assembler = useRef(new FriendChunkAssembler());
  const payloadRef = useRef({ island, completed, photos, displayName });

  useEffect(() => {
    payloadRef.current = { island, completed, photos, displayName };
  }, [completed, displayName, island, photos]);

  useEffect(() => () => {
    const plugin = pluginRef.current;
    listenerHandles.current.forEach((handle) => { void handle.remove(); });
    if (!plugin) return;
    void plugin.stopScan().catch(() => undefined);
    void plugin.stopAdvertising().catch(() => undefined);
    connectedRef.current.forEach((deviceId) => { void plugin.disconnect({ deviceId }).catch(() => undefined); });
  }, []);

  function currentPacket() {
    const current = payloadRef.current;
    return createFriendPacket({ ...current, sentAt: bluetoothTimestamp() });
  }

  function acceptPacket(packet: FriendPacket) {
    setReceived((items) => [packet, ...items.filter((item) => !(item.sender === packet.sender && item.sentAt === packet.sentAt))].slice(0, 6));
    setStatus(`${packet.sender}から${packet.completed.length}件の任務記録を受信しました。`);
  }

  async function requirePlugin(mode: "central" | "peripheral") {
    if (!nativeApp) throw new Error("Bluetooth友達同期はネイティブ版で利用してください");
    const { BluetoothLowEnergy } = await import("@capgo/capacitor-bluetooth-low-energy");
    await BluetoothLowEnergy.initialize({ mode, showPowerAlert: true });
    pluginRef.current = BluetoothLowEnergy;
    const permission = await BluetoothLowEnergy.requestPermissions();
    if (permission.bluetooth !== "granted") throw new Error("Bluetooth権限が許可されていません");
    const { available } = await BluetoothLowEnergy.isAvailable();
    if (!available) throw new Error("この端末はBluetooth LEに対応していません");
    const { enabled } = await BluetoothLowEnergy.isEnabled();
    if (!enabled) throw new Error("Bluetoothがオフです。設定でオンにしてください");
    return BluetoothLowEnergy;
  }

  async function stopCurrent() {
    const plugin = pluginRef.current;
    listenerHandles.current.forEach((handle) => { void handle.remove(); });
    listenerHandles.current = [];
    if (plugin) {
      await plugin.stopScan().catch(() => undefined);
      await plugin.stopAdvertising().catch(() => undefined);
      await plugin.removeGattService({ service: FRIEND_SERVICE_UUID }).catch(() => undefined);
      await Promise.all(connectedRef.current.map((deviceId) => plugin.disconnect({ deviceId }).catch(() => undefined)));
    }
    connectedRef.current = [];
    setConnected([]);
    setFound([]);
    roleRef.current = "idle";
    setRole("idle");
    setStatus("通信を停止しました。旅の記録は端末内に残ります。");
  }

  async function sendChunks(plugin: BluetoothPlugin, mode: Role, deviceId: string) {
    const chunks = chunkFriendPacket(currentPacket());
    for (const value of chunks) {
      if (mode === "host") {
        await plugin.notifyGattCharacteristicChanged({ service: FRIEND_SERVICE_UUID, characteristic: FRIEND_CHARACTERISTIC_UUID, value, deviceId });
      } else {
        await plugin.writeCharacteristic({ deviceId, service: FRIEND_SERVICE_UUID, characteristic: FRIEND_CHARACTERISTIC_UUID, value, type: "withResponse" });
      }
    }
  }

  async function startHost() {
    setBusy(true);
    try {
      await stopCurrent();
      const plugin = await requirePlugin("peripheral");
      roleRef.current = "host";
      setRole("host");
      listenerHandles.current = [
        await plugin.addListener("centralConnected", ({ deviceId }) => {
          connectedRef.current = [...new Set([...connectedRef.current, deviceId])];
          setConnected(connectedRef.current);
          setStatus("友達が接続しました。同期ボタンで現在の記録を送れます。");
        }),
        await plugin.addListener("centralDisconnected", ({ deviceId }) => {
          connectedRef.current = connectedRef.current.filter((id) => id !== deviceId);
          setConnected(connectedRef.current);
        }),
        await plugin.addListener("gattCharacteristicWriteRequest", (event) => {
          if (event.service.toLowerCase() !== FRIEND_SERVICE_UUID || event.characteristic.toLowerCase() !== FRIEND_CHARACTERISTIC_UUID) return;
          const packet = assembler.current.push(event.deviceId, event.value);
          if (!packet) return;
          acceptPacket(packet);
          void sendChunks(plugin, "host", event.deviceId).catch((error) => setStatus(errorText(error)));
        }),
      ];
      await plugin.addGattService({
        service: FRIEND_SERVICE_UUID,
        characteristics: [{
          uuid: FRIEND_CHARACTERISTIC_UUID,
          properties: { broadcast: false, read: true, writeWithoutResponse: true, write: true, notify: true, indicate: false, authenticatedSignedWrites: false, extendedProperties: false },
          value: [0],
        }],
      });
      await plugin.startAdvertising({ name: "SHIOBOSHI", services: [FRIEND_SERVICE_UUID], includeName: true });
      setStatus("募集しています。友達の端末で「友達を探す」を押してください。");
    } catch (error) {
      const message = errorText(error);
      await stopCurrent();
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }

  async function startGuest() {
    setBusy(true);
    try {
      await stopCurrent();
      const plugin = await requirePlugin("central");
      roleRef.current = "guest";
      setRole("guest");
      listenerHandles.current = [
        await plugin.addListener("deviceScanned", ({ device }) => {
          if (!(device.serviceUuids ?? []).some((uuid) => uuid.toLowerCase() === FRIEND_SERVICE_UUID)) return;
          setFound((items) => [{ deviceId: device.deviceId, name: device.name || "潮星の仲間", rssi: device.rssi }, ...items.filter((item) => item.deviceId !== device.deviceId)].slice(0, 8));
        }),
        await plugin.addListener("characteristicChanged", (event) => {
          if (event.service.toLowerCase() !== FRIEND_SERVICE_UUID || event.characteristic.toLowerCase() !== FRIEND_CHARACTERISTIC_UUID) return;
          const packet = assembler.current.push(event.deviceId, event.value);
          if (packet) acceptPacket(packet);
        }),
        await plugin.addListener("deviceDisconnected", ({ deviceId }) => {
          connectedRef.current = connectedRef.current.filter((id) => id !== deviceId);
          setConnected(connectedRef.current);
          setStatus("友達との接続が切れました。もう一度探せます。");
        }),
      ];
      await plugin.startScan({ services: [FRIEND_SERVICE_UUID], timeout: 12_000, allowDuplicates: false });
      setStatus("近くの潮星アプリを探しています…");
    } catch (error) {
      const message = errorText(error);
      await stopCurrent();
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }

  async function connectFriend(deviceId: string) {
    const plugin = pluginRef.current;
    if (!plugin) return;
    setBusy(true);
    try {
      await plugin.stopScan().catch(() => undefined);
      await plugin.connect({ deviceId });
      await plugin.discoverServices({ deviceId });
      await plugin.startCharacteristicNotifications({ deviceId, service: FRIEND_SERVICE_UUID, characteristic: FRIEND_CHARACTERISTIC_UUID });
      connectedRef.current = [deviceId];
      setConnected([deviceId]);
      await sendChunks(plugin, "guest", deviceId);
      setStatus("接続しました。任務数と写真タグを同期しました。");
    } catch (error) {
      await plugin.disconnect({ deviceId }).catch(() => undefined);
      setStatus(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  async function syncNow() {
    const plugin = pluginRef.current;
    if (!plugin || connectedRef.current.length === 0) { setStatus("先に友達と接続してください。"); return; }
    setBusy(true);
    try {
      for (const deviceId of connectedRef.current) await sendChunks(plugin, roleRef.current, deviceId);
      setStatus("現在の任務数と写真タグを送信しました。");
    } catch (error) {
      setStatus(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  async function openBluetoothSettings() {
    try { await pluginRef.current?.openBluetoothSettings(); } catch { await pluginRef.current?.openAppSettings(); }
  }

  return <section className={styles.friendPanel} aria-labelledby="friend-sync-title">
    <header><div><small>FRIEND LINK · BLUETOOTH LE</small><h3 id="friend-sync-title">友達と旅の記録を同期</h3></div><span>{connected.length > 0 ? `${connected.length}台接続` : role === "host" ? "募集中" : role === "guest" ? "探索中" : "未接続"}</span></header>
    <p>位置情報・APIキー・写真本体は送りません。任務数、写真の標本タグ、表示名だけを近くの端末へ送ります。</p>
    <label>この端末の表示名<input value={displayName} maxLength={16} onChange={(event) => setDisplayName(event.target.value)} /></label>
    <div className={styles.friendActions}>
      {role === "idle" ? <><button type="button" disabled={busy || !nativeApp} onClick={() => void startHost()}>友達を募集</button><button type="button" disabled={busy || !nativeApp} onClick={() => void startGuest()}>友達を探す</button></> : <><button type="button" disabled={busy} onClick={() => void syncNow()}>今の記録を同期</button><button type="button" className={styles.secondary} onClick={() => void stopCurrent()}>通信を停止</button></>}
    </div>
    <div className={styles.friendStatus} role="status"><strong>{status}</strong>{nativeApp && status.includes("オフ") && <button type="button" onClick={() => void openBluetoothSettings()}>Bluetooth設定を開く</button>}</div>
    {role === "guest" && found.length > 0 && <div className={styles.friendList} aria-label="見つかった友達">{found.map((friend) => <button type="button" disabled={busy || connected.includes(friend.deviceId)} onClick={() => void connectFriend(friend.deviceId)} key={friend.deviceId}><span><strong>{friend.name}</strong><small>電波 {friend.rssi} dBm</small></span><b>{connected.includes(friend.deviceId) ? "接続済み" : "接続"}</b></button>)}</div>}
    {received.length > 0 && <div className={styles.receivedList}><small>受信した旅の記録</small>{received.slice(0, 3).map((packet) => <article key={`${packet.sender}-${packet.sentAt}`}><header><strong>{packet.sender}</strong><span>{packet.completed.length}任務</span></header><p>{packet.photos.length > 0 ? packet.photos.map((photo) => photo.tag).join("・") : "写真タグはまだありません"}</p><time>{new Date(packet.sentAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}</time></article>)}</div>}
    <footer>{islandName}の記録を共有中。写真そのものは各端末内に残ります。</footer>
  </section>;
}
