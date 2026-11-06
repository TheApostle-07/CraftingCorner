export type SearchParam = string | string[] | undefined;

export function firstSearchParam(value: SearchParam) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function searchPage(value: SearchParam) {
  const page = Number(firstSearchParam(value));
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}
