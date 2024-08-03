export default function stripTags(html: string) {
  const pattern = /<\/?[^>]*>/gi;

  return html.replace(pattern, '');
}
