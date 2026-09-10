import assert from "node:assert";

// mirror of decode() in content.js
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

const b64 = s => Buffer.from(s).toString("base64");

assert.strictEqual(decode(b64("https://example.com/path?q=1")), "https://example.com/path?q=1");
assert.strictEqual(decode(b64("https://例え.jp/ページ")), "https://例え.jp/ページ"); // utf-8
assert.strictEqual(decode(b64("hello world not a url long enough")), null);
assert.strictEqual(decode("not!base64!!!!!!!!!!"), null);
assert.strictEqual(
  decode(Buffer.from("https://a.co/x").toString("base64url")),
  "https://a.co/x"
); // base64url with - _

console.log("ok");
