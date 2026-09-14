export interface Coupon {
  code: string; // stored uppercase for case-insensitive matching
  percent: number; // discount percentage
  label: string; // shown to the user
}

export const coupons: Coupon[] = [
  { code: "VED", percent: 25, label: "VED — 25% off" },
  { code: "RUGVED", percent: 20, label: "RUGVED — 20% off" },
  { code: "RADHA", percent: 10, label: "RADHA — 10% off" },
  { code: "KHOUSIC", percent: 5, label: "KHOUSIC — 5% off" },
];

/** Look up a coupon by code, case-insensitive and trimmed. */
export function findCoupon(input: string): Coupon | undefined {
  const code = input.trim().toUpperCase();
  if (!code) return undefined;
  return coupons.find((c) => c.code === code);
}
