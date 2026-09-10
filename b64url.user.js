// ==UserScript==
// @name         base64 URL auto-decoder
// @namespace    https://github.com/LEemod123443/b64url-decode
// @version      1.2.0
// @description  Detects base64 / base64url encoded URLs in page text and turns them into working links.
// @author       you
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @downloadURL  https://leemod123443.github.io/b64url-decode/b64url.user.js
// @updateURL    https://leemod123443.github.io/b64url-decode/b64url.user.js
// ==/UserScript==

(() => {
  "use strict";
  const TOKEN = /[A-Za-z0-9_\-+/]{16,}={0,2}/g;
  const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE"]);
  const STYLE = "background:#ffe100;color:#000;border-radius:3px;padding:0 3px;text-decoration:underline;font-weight:600;";

  function decode(tok) {
    try {
      const b64 = tok.replace(/-/g, "+").replace(/_/g, "/");
      const bin = atob(b64);
      const url = decodeURIComponent(
        Array.from(bin, c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
      );
      return /^https?:\/\/[^\s]+$/.test(url) ? url : null;
    } catch {
      return null;
    }
  }

  function process(node) {
    const text = node.nodeValue;
    TOKEN.lastIndex = 0;
    if (!TOKEN.test(text)) return;

    const anchor = node.parentElement.closest("a");
    const parts = text.split(TOKEN);
    const tokens = text.match(TOKEN) || [];
    const frag = document.createDocumentFragment();
    let changed = false;

    parts.forEach((chunk, i) => {
      if (chunk) frag.appendChild(document.createTextNode(chunk));
      const tok = tokens[i];
      if (tok === undefined) return;
      const url = decode(tok);
      if (!url) {
        frag.appendChild(document.createTextNode(tok));
        return;
      }
      changed = true;
      if (anchor) {
        anchor.href = url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.style.cssText += STYLE;
        frag.appendChild(document.createTextNode(url));
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.textContent = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.style.cssText = STYLE;
        frag.appendChild(a);
      }
    });

    if (changed) node.replaceWith(frag);
  }

  function walk(root) {
    const it = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n =>
        n.parentElement &&
        !SKIP.has(n.parentElement.tagName) &&
        !n.parentElement.isContentEditable &&
        TOKEN.test(n.nodeValue)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT,
    });
    const nodes = [];
    let n;
    while ((n = it.nextNode())) nodes.push(n);
    nodes.forEach(process);
  }

  walk(document.body);
  new MutationObserver(muts => {
    for (const m of muts) for (const node of m.addedNodes) {
      if (node.nodeType === 1) walk(node);
      else if (node.nodeType === 3 && node.parentElement) walk(node.parentElement);
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
