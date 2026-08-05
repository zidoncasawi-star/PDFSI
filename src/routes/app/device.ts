// Classic UA sniff for "this is a phone or tablet" — used to hide the
// "Scan QR / sign on your phone" option when we're already on a phone or
// tablet (drawing directly with a finger is strictly better there; the
// handoff QR code only makes sense from a computer).
export function isMobileOrTabletDevice(): boolean {
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPad|iPod|Mobi/i.test(ua)) return true;
  // iPadOS Safari reports as "Macintosh" but exposes multi-touch.
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return true;
  return false;
}
