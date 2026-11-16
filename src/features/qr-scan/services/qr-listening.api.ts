/**
 * Save a QR listening session only after expo-audio reports actual playback.
 * Backend POST /api/v1/listening/qr-scans is idempotent by listening event ID.
 */
import { File, Paths } from "expo-file-system";
import { Platform } from "react-native";

import { getApiBaseUrl } from "./qr-scan.api";

const INSTALLATION_STORAGE_KEY = "mnr.listening.installationId";
const INSTALLATION_STORAGE_FILE = "mnr-listening-installation-id.txt";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type QrListeningAck = {
  id: string;
  result: "CREATED" | "UPDATED" | "UNCHANGED";
};

type QrListeningStart = {
  qrCode: string;
  poiContentId: string;
};

function randomHex8(): string {
  // IDs are non-secret deduplication identifiers, not authentication tokens.
  return Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, "0");
}

function makeInstallationId(): string {
  const a = randomHex8();
  const b = randomHex8();
  const c = randomHex8();
  const d = randomHex8();

  return (
    a + "-" + b.slice(0, 4) + "-4" + b.slice(5) + "-" +
    "8" + c.slice(1, 4) + "-" + c.slice(4) + d
  );
}

function makeEventId(now: Date): string {
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(now.getUTCFullYear() % 100).padStart(2, "0");
  return "listen-" + dd + mm + yy + "-" + randomHex8();
}

async function loadOrCreateInstallationId(): Promise<string> {
  if (Platform.OS === "web") {
    const saved = window.localStorage.getItem(INSTALLATION_STORAGE_KEY);
    if (saved && UUID_PATTERN.test(saved)) {
      return saved;
    }
    const created = makeInstallationId();
    window.localStorage.setItem(INSTALLATION_STORAGE_KEY, created);
    return created;
  }

  const file = new File(Paths.document, INSTALLATION_STORAGE_FILE);
  if (file.exists) {
    const saved = (await file.text()).trim();
    if (UUID_PATTERN.test(saved)) {
      return saved;
    }
  }

  const created = makeInstallationId();
  if (!file.exists) {
    file.create();
  }
  file.write(created);
  return created;
}

// One installation ID across QR visits and across app restarts.
let installationIdPromise: Promise<string> | null = null;

async function getInstallationId(): Promise<string> {
  if (installationIdPromise === null) {
    installationIdPromise = loadOrCreateInstallationId().catch((error: unknown) => {
      installationIdPromise = null;
      throw error;
    });
  }
  return installationIdPromise;
}

export async function recordQrListeningStart({
  qrCode,
  poiContentId,
}: QrListeningStart): Promise<QrListeningAck> {
  const now = new Date();
  const event = {
    id: makeEventId(now),
    installation_id: await getInstallationId(),
    qr_code: qrCode,
    poi_content_id: poiContentId,
    scanned_at: now.toISOString(),
  };

  const response = await fetch(getApiBaseUrl() + "/api/v1/listening/qr-scans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error("HTTP " + response.status + ": " + detail);
  }

  const body: unknown = await response.json();
  if (
    !body ||
    typeof body !== "object" ||
    !("id" in body) ||
    !("result" in body) ||
    typeof body.id !== "string" ||
    (body.result !== "CREATED" && body.result !== "UPDATED" && body.result !== "UNCHANGED")
  ) {
    throw new Error("Invalid listening acknowledgment from backend");
  }

  return { id: body.id, result: body.result };
}
