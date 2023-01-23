export function addOpacityToHsl(hsl: string, opacity: number) {
  const betweenParens = hsl.match(/\(([^)]+)\)/)?.[1];
  const [h, s, l] = betweenParens?.split(",") ?? [];
  return `hsla(${h}, ${s}, ${l}, ${opacity})`;
}

export const isExternalLink = (href: string) => !href.startsWith("/");
