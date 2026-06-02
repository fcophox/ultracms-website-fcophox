export function mapToLocale(item: any, locale: string) {
  if (!item) return item;

  if (locale === 'en') {
    return {
      ...item,
      title: item.title_en || item.title,
      slug: item.slug_en || item.slug,
      content: item.content_en || item.content,
    };
  }

  return item;
}

export function mapArrayToLocale(items: any[], locale: string) {
  if (!items) return [];
  return items.map((item) => mapToLocale(item, locale));
}
