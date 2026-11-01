import { put, list } from '@vercel/blob';
export const SLOT = /^(gal-[0-7]|bg|logo|cat-(passport|visa|wedding|frames|albums|photoshoot|product)-[0-7])$/;
export async function readManifest() {
  const { blobs } = await list({ prefix: 'manifest.json' });
  const b = blobs.find(x => x.pathname === 'manifest.json');
  if (!b) return {};
  try { return await (await fetch(b.url + '?t=' + Date.now())).json(); } catch { return {}; }
}
export async function writeManifest(m) {
  await put('manifest.json', JSON.stringify(m), { access: 'public', contentType: 'application/json',
    addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 30 });
}
export const authed = req => !!process.env.ADMIN_PASSWORD && req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD;
