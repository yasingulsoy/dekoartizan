const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

function normalizeBlogHtml(html) {
  if (typeof html !== 'string') return html;

  // NBSP varyantları ve sık görülen yazım hatası (&nsbp) -> normal boşluk
  return html
    .replace(/\u00A0/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&nsbp;?/gi, ' ');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function safeDecodeBase64(base64Str) {
  // base64 string bazı editörlerde satır aralarıyla gelebiliyor
  const cleaned = base64Str.replace(/\s+/g, '');
  return Buffer.from(cleaned, 'base64');
}

/**
 * HTML içindeki data:image/...;base64,... img src'lerini dosyaya yazar ve src'leri
 * /uploads/blogsWall/{blogId}/{filename} şeklinde değiştirir.
 *
 * @returns {{ html: string, saved: string[] }}
 */
function persistInlineImagesToBlogsWall({ html, blogId, blogsWallDir }) {
  if (typeof html !== 'string' || !html) return { html, saved: [] };
  if (!blogId) throw new Error('blogId gerekli');
  if (!blogsWallDir) throw new Error('blogsWallDir gerekli');

  const blogDir = path.join(blogsWallDir, blogId.toString());
  ensureDir(blogDir);

  const saved = [];
  let out = '';
  let lastIndex = 0;

  // Hem tek hem çift tırnak destekler
  // src="data:image/png;base64,...."
  const re = /<img\b[^>]*?\bsrc\s*=\s*(['"])\s*(data:image\/[a-zA-Z0-9+.-]+;base64,([\s\S]*?))\s*\1/gi;

  let m;
  while ((m = re.exec(html)) !== null) {
    const fullMatch = m[0];
    const quote = m[1];
    const dataUri = m[2];

    // dataUri: data:image/xxx;base64,AAA...
    const commaIdx = dataUri.indexOf(',');
    if (commaIdx === -1) continue;

    const meta = dataUri.slice(0, commaIdx); // data:image/png;base64
    const b64 = dataUri.slice(commaIdx + 1);

    const mimeMatch = /^data:(image\/[a-zA-Z0-9+.-]+);base64$/i.exec(meta);
    const mime = mimeMatch ? mimeMatch[1].toLowerCase() : null;
    const ext = mime && MIME_TO_EXT[mime];

    // Desteklenmeyen türleri atla (svg+xml vs.)
    if (!ext) continue;

    const buf = safeDecodeBase64(b64);

    // Boş/bozuk base64 ise dokunma
    if (!buf || !buf.length) continue;

    const name = `content_${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const filePath = path.join(blogDir, name);
    fs.writeFileSync(filePath, buf);

    const publicUrl = `/uploads/blogsWall/${blogId}/${name}`;
    saved.push(publicUrl);

    // Bu match'e kadar olan kısmı yaz
    out += html.slice(lastIndex, m.index);

    // fullMatch içinde src="...dataUri..." kısmını publicUrl ile değiştir
    const replaced = fullMatch.replace(
      new RegExp(`\\bsrc\\s*=\\s*${quote}[\\s\\S]*?${quote}`, 'i'),
      `src=${quote}${publicUrl}${quote}`
    );
    out += replaced;

    lastIndex = m.index + fullMatch.length;
  }

  out += html.slice(lastIndex);
  return { html: out, saved };
}

/**
 * Blog klasöründe, içerikte referans edilmeyen content_* dosyalarını siler.
 * Kapak resmi (blogId.*) gibi dosyalara dokunmaz.
 */
function cleanupUnreferencedContentImages({ html, blogId, blogsWallDir }) {
  if (typeof html !== 'string' || !html) return;
  if (!blogId || !blogsWallDir) return;

  const blogDir = path.join(blogsWallDir, blogId.toString());
  if (!fs.existsSync(blogDir)) return;

  // İçerikte geçen bu blog'a ait url'lerden dosya adlarını çıkar
  const referenced = new Set();
  const urlRe = new RegExp(`/uploads/blogsWall/${blogId}/([^"'>\\s]+)`, 'gi');
  let m;
  while ((m = urlRe.exec(html)) !== null) {
    referenced.add(m[1]);
  }

  const files = fs.readdirSync(blogDir);
  for (const f of files) {
    // Sadece içerik resimlerini hedefle
    if (!/^content_/.test(f)) continue;
    if (!referenced.has(f)) {
      try {
        fs.unlinkSync(path.join(blogDir, f));
      } catch (_) {
        // best-effort
      }
    }
  }
}

module.exports = {
  normalizeBlogHtml,
  persistInlineImagesToBlogsWall,
  cleanupUnreferencedContentImages,
};

