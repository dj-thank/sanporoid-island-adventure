# 潮星 Friend Link — Bluetooth LE 設計と境界

確認日: 2026-08-29 JST

## 採用実装

- Plugin: `@capgo/capacitor-bluetooth-low-energy@8.2.0`
- Upstream: https://github.com/Cap-go/capacitor-bluetooth-low-energy
- License: MPL-2.0
- Capacitor compatibility: upstream `8.2.0` is based on Capacitor 8 and declares `@capacitor/core >=8.0.0`.
- Roles: Android / iOS の central と peripheral。`8.2.0`でローカルGATT service、write request、notificationが公開されている。

`@capacitor-community/bluetooth-le` はCapacitor 8対応だがcentral roleだけなので、スマートフォン同士が同じアプリで募集側と参加側になる要件には使用しない。

## 送るもの

- 利用者が入力した16文字以内の表示名
- 現在表示中の島ID
- 完了した任務ID（最大12件）
- 写真から端末内で生成した標本タグ、地点名、色（最大4件）
- メッセージ識別用時刻

送らないもの:

- 緯度・経度
- OpenAI APIキー
- 写真画像のバイト列
- アカウント、電話番号、連絡先
- バックグラウンド追跡情報

## 通信方式

- Service UUID: `a72b7d10-4f4c-4d20-b5e7-7368696f626f`
- Characteristic UUID: `a72b7d11-4f4c-4d20-b5e7-7368696f626f`
- 1チャンク20 bytes以下（6 bytes header + 最大14 bytes payload）
- 受信側は端末ID・シーケンス・通番で再構成し、`shioboshi.friend.v1`だけを受理する。
- 受信した任務は相手の記録として表示し、自端末の到着判定を自動昇格しない。

## 権限とフォールバック

- Android 12以降: `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, `BLUETOOTH_ADVERTISE`。Plugin manifestからマージする。
- Android 11以前: Bluetooth権限とBLE scan用位置権限。位置は既存のチェックポイント判定でも利用する。
- iOS: `NSBluetoothAlwaysUsageDescription`, `NSBluetoothPeripheralUsageDescription`。
- BLEをアプリ必須機能にはせず、Android manifestで `android.hardware.bluetooth_le` を `required=false` に上書きする。
- iOS SimulatorではBluetoothを検証できない。物理Android/iPhone 2台でのみ `DEVICE_PASS` にできる。
- 公開PWAではボタンを無効化し、ネイティブ版限定であることを表示する。iOS SafariはFriend Linkの実行面にしない。

## 安全境界

Bluetooth権限は「友達を募集」「友達を探す」を利用者が押した後にだけ要求する。自動スキャン、自動接続、バックグラウンド広告、写真本体の送信は行わない。
