import "server-only";
import {
  initializeApp,
  getApps,
  getApp,
  cert,
  applicationDefault,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * Server-side Firebase Admin SDK. Used by API routes and server-only stores to
 * read/write Firestore and Firebase Storage with full privileges.
 *
 * Credentials (in order of preference):
 *  1. FIREBASE_SERVICE_ACCOUNT_KEY — the full service-account JSON as a string
 *     (recommended for env-based hosting; keep out of git).
 *  2. GOOGLE_APPLICATION_CREDENTIALS / applicationDefault() — used automatically
 *     on Firebase App Hosting and Google Cloud, no key file needed.
 *
 * The storage bucket comes from FIREBASE_STORAGE_BUCKET (e.g.
 * "your-project.appspot.com").
 */

function buildApp(): App {
  if (getApps().length) return getApp();

  const bucket = process.env.FIREBASE_STORAGE_BUCKET;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (raw) {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Support keys pasted with escaped newlines.
      parsed = JSON.parse(raw.replace(/\\n/g, "\n"));
    }
    // Ensure the private key's newlines are real newlines.
    if (typeof parsed.private_key === "string") {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return initializeApp({
      credential: cert(parsed as Parameters<typeof cert>[0]),
      storageBucket: bucket,
    });
  }

  // Fall back to Application Default Credentials (App Hosting / GCP).
  return initializeApp({
    credential: applicationDefault(),
    storageBucket: bucket,
  });
}

const app = buildApp();

export const adminDb: Firestore = getFirestore(app);
export const adminStorage = getStorage(app);

/** The default Storage bucket handle. */
export function bucket() {
  return adminStorage.bucket();
}
