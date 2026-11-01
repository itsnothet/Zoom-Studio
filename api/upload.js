import { put, del } from '@vercel/blob';
import { SLOT, readManifest, writeManifest, authed } from './_lib.js';
const MAX = 4 * 1024 * 1024; // images are compressed in the browser first; hard cap here
const kind = b => b[0]===0xFF&&b[1]===0xD8 ? 'jpg' : b.slice(0,4).toString()==='RIFF'&&b.slice(8,12).toString()==='WEBP' ? 'webp' : b[0]===0x89&&b[1]===0x50 ? 'png' : null;
async function body(req) { const c = []; let n = 0; for await (const d of req) { n += d.length; if (n > MAX) throw new Error('big'); c.push(d); } return Buffer.concat(c); }
export default async function handler(req, res) {
  if (!authed(req)) return res.status(401).json({ error: 'Wrong password' });
  if (req.method === 'GET') return res.status(200).json({ ok: true });
  const slot = String(req.query.slot || '');
  if (!SLOT.test(slot)) return res.status(400).json({ error: 'Bad slot' });
  try {
    const m = await readManifest();
    if (req.method === 'DELETE') {
      if (m[slot]) { try { await del(m[slot]); } catch {} delete m[slot]; await writeManifest(m); }
      return res.status(200).json({ ok: true });
    }
    if (req.method !== 'POST') return res.status(405).end();
    const buf = await body(req), ext = kind(buf);
    if (!ext) return res.status(400).json({ error: 'Not an image' });
    const blob = await put(`photos/${slot}-${Date.now()}.${ext}`, buf, { access: 'public', contentType: 'image/' + (ext === 'jpg' ? 'jpeg' : ext) });
    if (m[slot]) { try { await del(m[slot]); } catch {} }
    m[slot] = blob.url; await writeManifest(m);
    res.status(200).json({ url: blob.url });
  } catch (e) { res.status(e.message === 'big' ? 413 : 500).json({ error: e.message === 'big' ? 'Image too large' : 'Server error' }); }
}
