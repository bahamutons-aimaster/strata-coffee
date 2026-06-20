import 'server-only';
import { put, get, list, del } from '@vercel/blob';

/**
 * Helper baca/tulis JSON ke Vercel Blob. Ini PENGGANTI fs.readFileSync/
 * writeFileSync yang sebelumnya dipakai — filesystem di Vercel itu read-only
 * (kecuali /tmp, dan itu pun ke-reset tiap kali), jadi semua data
 * (content, leads, analytics) wajib disimpan di storage eksternal kayak ini.
 *
 * Semua blob disimpan 'private' (gak ada URL publik buat data internal kayak
 * leads/analytics) dengan addRandomSuffix:false + allowOverwrite:true biar
 * path-nya selalu sama dan bisa ditimpa berkali-kali.
 */

export async function readJson<T>(pathname: string): Promise<T | null> {
  try {
    const result = await get(pathname, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as T;
  } catch {
    // Blob belum pernah dibuat (belum pernah di-save) → wajar, bukan error
    return null;
  }
}

export async function writeJson(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

export async function listBlobs(prefix: string) {
  const result = await list({ prefix });
  return result.blobs;
}

export async function deleteBlob(pathnameOrUrl: string): Promise<void> {
  await del(pathnameOrUrl);
}
