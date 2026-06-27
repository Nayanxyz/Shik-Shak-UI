import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useMemo } from 'react';

export default function MathHtml({ html, className }: { html: string; className?: string }) {
  const processed = useMemo(() => {
    if (!html) return '';
    let result = html.replace(/\f/g, '\\f');
    result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
      try { return katex.renderToString(tex.trim(), { throwOnError: false, displayMode: true }); }
      catch { return `$$${tex}$$`; }
    });
    result = result.replace(/\$([^$\n]+?)\$/g, (_, tex) => {
      try { return katex.renderToString(tex.trim(), { throwOnError: false, displayMode: false }); }
      catch { return `$${tex}$`; }
    });
    return result;
  }, [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: processed }} />;
}