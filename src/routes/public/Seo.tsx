import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SeoProps {
  title: string;
  description: string;
  jsonLd?: object;
}

const SITE_ORIGIN = 'https://signpdf.site';
const JSON_LD_ID = 'seo-json-ld';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Client-side SEO tags. This is a plain Vite SPA (no server-side rendering
// at request time), but the build's postbuild step (scripts/prerender.mjs)
// snapshots each public route's rendered <head> into a static HTML file, so
// these per-page tags — including canonical, which MUST differ per route —
// end up baked into what crawlers see.
export default function Seo({ title, description, jsonLd }: SeoProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', `${SITE_ORIGIN}${pathname}`, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setCanonical(`${SITE_ORIGIN}${pathname}`);

    let script: HTMLScriptElement | null = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = JSON_LD_ID;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }

    return () => {
      document.getElementById(JSON_LD_ID)?.remove();
    };
  }, [title, description, jsonLd, pathname]);

  return null;
}
