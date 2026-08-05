import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  jsonLd?: object;
}

const SITE_NAME = 'Sign Pdf';
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

// Client-side SEO tags. This is a plain Vite SPA (no server-side rendering),
// so search engines only see these once they execute JS — good enough for
// Google, but if SEO is mission-critical, consider pre-rendering/SSR later.
export default function Seo({ title, description, jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    setMeta('description', description);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

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
  }, [title, description, jsonLd]);

  return null;
}
