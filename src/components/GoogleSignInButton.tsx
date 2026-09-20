"use client";

import { useState } from "react";
import { getFirebaseApp } from "@/lib/firebase/client";
import { useAuth } from "@/context/AuthContext";

/**
 * "Sign in with Google" button. Runs the Firebase Google popup in the browser,
 * then posts the resulting ID token to /api/auth/google, which verifies it and
 * sets our session cookie.
 *
 * Requires the Google provider to be enabled in the Firebase console
 * (Authentication -> Sign-in method -> Google).
 */
export default function GoogleSignInButton() {
  const { refresh } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const signIn = async () => {
    setBusy(true);
    setError("");
    try {
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import(
        "firebase/auth"
      );
      const auth = getAuth(getFirebaseApp());
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        await refresh();
      } else {
        setError(data.error || "Google sign-in failed.");
      }
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code ?? "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        // User closed the popup — no error needed.
      } else if (code === "auth/operation-not-allowed") {
        setError("Google sign-in isn't enabled yet. Please try email instead.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={signIn}
        disabled={busy}
        className="flex w-full items-center justify-center gap-3 rounded-md border border-maroon/20 bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream-dark disabled:opacity-50"
      >
        <GoogleGlyph />
        {busy ? "Signing in…" : "Continue with Google"}
      </button>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.4 36.2 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}
