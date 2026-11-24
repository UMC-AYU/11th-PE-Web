export type PageSearchParams = Record<string, string | string[] | undefined>;

export function parsePage(value: string | string[] | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 1 ? Math.min(page, 500) : 1;
}
