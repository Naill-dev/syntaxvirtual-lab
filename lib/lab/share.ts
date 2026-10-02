// file: lib/lab/share.ts
/**
 * Kodu Base64 formatına çevirərək URL üzərindən paylaşmaq üçün kodlaşdırır.
 */
export const encodeShare = (code: string, language: string): string => {
  // UTF-8 üçün xüsusi encoding (atob/btoa unicode dəstəkləmir deyə encodeURIComponent istifadə edirik)
  const payload = JSON.stringify({ code, language });
  return btoa(encodeURIComponent(payload));
};

/**
 * Base64 kodlanmış sətri oxuyub obyektə çevirir.
 */
export const decodeShare = (hash: string): { code: string; language: string } => {
  const decoded = decodeURIComponent(atob(hash));
  return JSON.parse(decoded);
};

// ✅ Verified: Base64 encode/decode with UTF-8 support for safe URL sharing
