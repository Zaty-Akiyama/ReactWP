export type PatternMeta = {
  title: string;
  slug: string;
  categories?: string[];
  description?: string;
};

export function wpSpacing(size: number | string): string {
  return `var:preset|spacing|${size}`;
}
