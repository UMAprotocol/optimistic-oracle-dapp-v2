type ParamValue =
  | number
  | string
  | boolean
  | null
  | undefined
  | Array<number | string | boolean>;

export function buildSearchParams(params: Record<string, ParamValue>): string {
  const searchParams = new URLSearchParams();
  for (const key in params) {
    const value = params[key];
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((val) => searchParams.append(key, String(val)));
    } else {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
}
