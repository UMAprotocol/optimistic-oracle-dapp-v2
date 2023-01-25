export function addOpacityToHsl(hsl: string, opacity: number) {
  const betweenParens = hsl.match(/\(([^)]+)\)/)?.[1];
  const [h, s, l] = betweenParens?.split(",") ?? [];
  return `hsla(${h}, ${s}, ${l}, ${opacity})`;
}

export const isExternalLink = (href: string) => !href.startsWith("/");

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function determinePage(pathname: string) {
  if (pathname === "/propose") return "propose";
  if (pathname === "/settled") return "settled";
  return "verify";
}
