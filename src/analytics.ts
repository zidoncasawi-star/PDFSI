// gtag.js's own 'config' call only fires once, on initial page load — this
// is a single-page app, so client-side navigation (React Router) between
// routes wouldn't otherwise register as separate pageviews in GA.
export function trackPageView(path: string) {
  const gtag = (window as any).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.origin + path
  });
}
