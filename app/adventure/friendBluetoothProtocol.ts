export const FRIEND_SERVICE_UUID = "a72b7d10-4f4c-4d20-b5e7-7368696f626f";
export const FRIEND_CHARACTERISTIC_UUID = "a72b7d11-4f4c-4d20-b5e7-7368696f626f";
export const FRIEND_PROTOCOL = "shioboshi.friend.v1";

const HEADER_SIZE = 6;
const CHUNK_PAYLOAD_SIZE = 14;
const MAX_CHUNKS = 255;

export type FriendPhotoNote = {
  checkpointId: string;
  checkpointTitle: string;
  tag: string;
  color: string;
};

export type FriendPacket = {
  protocol: typeof FRIEND_PROTOCOL;
  sender: string;
  island: string;
  completed: string[];
  photos: FriendPhotoNote[];
  sentAt: number;
};

type FriendPacketInput = Omit<FriendPacket, "protocol" | "sender" | "completed" | "photos"> & {
  sender?: string;
  completed: string[];
  photos: FriendPhotoNote[];
};

function boundedText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function createFriendPacket(input: FriendPacketInput): FriendPacket {
  return {
    protocol: FRIEND_PROTOCOL,
    sender: boundedText(input.sender, 16) || "旅の仲間",
    island: boundedText(input.island, 24),
    completed: [...new Set(input.completed.map((value) => boundedText(value, 48)).filter(Boolean))].slice(0, 12),
    photos: input.photos.slice(0, 4).map((photo) => ({
      checkpointId: boundedText(photo.checkpointId, 48),
      checkpointTitle: boundedText(photo.checkpointTitle, 32),
      tag: boundedText(photo.tag, 24),
      color: /^#[0-9a-f]{6}$/i.test(photo.color) ? photo.color : "#65c8c0",
    })),
    sentAt: Number.isFinite(input.sentAt) ? Math.floor(input.sentAt) : Date.now(),
  };
}

export function parseFriendPacket(value: unknown): FriendPacket | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<FriendPacket>;
  if (candidate.protocol !== FRIEND_PROTOCOL || !Array.isArray(candidate.completed) || !Array.isArray(candidate.photos)) return null;
  if (typeof candidate.island !== "string" || typeof candidate.sentAt !== "number") return null;
  return createFriendPacket({
    sender: candidate.sender,
    island: candidate.island,
    completed: candidate.completed.filter((item): item is string => typeof item === "string"),
    photos: candidate.photos.filter((item): item is FriendPhotoNote => Boolean(item) && typeof item === "object").map((item) => ({
      checkpointId: boundedText(item.checkpointId, 48),
      checkpointTitle: boundedText(item.checkpointTitle, 32),
      tag: boundedText(item.tag, 24),
      color: boundedText(item.color, 7),
    })),
    sentAt: candidate.sentAt,
  });
}

export function chunkFriendPacket(packet: FriendPacket): number[][] {
  const body = new TextEncoder().encode(JSON.stringify(packet));
  const total = Math.max(1, Math.ceil(body.length / CHUNK_PAYLOAD_SIZE));
  if (total > MAX_CHUNKS) throw new Error("友達同期データが大きすぎます");
  const sequence = packet.sentAt & 0xff;
  return Array.from({ length: total }, (_, index) => [
    0x53,
    0x48,
    0x01,
    sequence,
    index,
    total,
    ...body.slice(index * CHUNK_PAYLOAD_SIZE, (index + 1) * CHUNK_PAYLOAD_SIZE),
  ]);
}

export class FriendChunkAssembler {
  private readonly transfers = new Map<string, { total: number; chunks: Array<Uint8Array | undefined> }>();

  push(deviceId: string, value: number[]): FriendPacket | null {
    if (value.length < HEADER_SIZE || value[0] !== 0x53 || value[1] !== 0x48 || value[2] !== 0x01) return null;
    const sequence = value[3];
    const index = value[4];
    const total = value[5];
    if (!Number.isInteger(index) || !Number.isInteger(total) || total < 1 || total > MAX_CHUNKS || index >= total) return null;
    const key = `${deviceId}:${sequence}`;
    const existing = this.transfers.get(key);
    const transfer = existing?.total === total ? existing : { total, chunks: Array.from({ length: total }) };
    transfer.chunks[index] = Uint8Array.from(value.slice(HEADER_SIZE));
    this.transfers.set(key, transfer);
    if (transfer.chunks.some((chunk) => !chunk)) return null;
    this.transfers.delete(key);
    const size = transfer.chunks.reduce((sum, chunk) => sum + (chunk?.length ?? 0), 0);
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of transfer.chunks) {
      if (!chunk) return null;
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    try {
      return parseFriendPacket(JSON.parse(new TextDecoder().decode(bytes)));
    } catch {
      return null;
    }
  }
}
