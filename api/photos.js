import { readManifest } from './_lib.js';
export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=60');
    res.status(200).json(await readManifest());
  } catch (e) { res.status(200).json({}); }
}
