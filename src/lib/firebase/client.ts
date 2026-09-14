"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

/**
 * Client-side Firebase (browser). Uses NEXT_PUBLIC_* env vars, which are safe
 * to expose — Firebase web config is not a secret. Analytics is initialised
 * lazily and only in supported (browser) environments.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCCXtpefs6c_kVnEDyk29C4YgeJIJWQdnA",
  authDomain: "vastravedh-7e730.firebaseapp.com",
  projectId: "vastravedh-7e730",
  storageBucket: "vastravedh-7e730.firebasestorage.app",
  messagingSenderId: "306736641116",
  appId: "1:306736641116:web:3583ddc5edaec047ed6299",
  measurementId: "G-8GZ76YC7BV"
};


export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let analyticsPromise: Promise<Analytics | null> | null = null;

/** Initialise Analytics once, only in browsers that support it. */
export function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!firebaseConfig.measurementId) return Promise.resolve(null);
  if (!analyticsPromise) {
    analyticsPromise = isSupported().then((ok) =>
      ok ? getAnalytics(getFirebaseApp()) : null
    );
  }
  return analyticsPromise;
}
