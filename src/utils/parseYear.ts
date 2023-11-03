export default function parseYear(url: URL) {
  const { hash } = url;
  if (!hash) return undefined;
  const year = hash.replace("#year=", "");
  return year;
}
