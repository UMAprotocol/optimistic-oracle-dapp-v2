import { addOpacityToColor } from "@/helpers";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Props {
  variant?: "grey" | "white";
  count?: number;
  baseColor?: string;
  highlightColor?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  inline?: boolean;
  duration?: number;
}
export function LoadingSkeleton({
  variant = "grey",
  count,
  baseColor,
  highlightColor,
  width,
  height,
  borderRadius = 16,
  inline = false,
  duration,
}: Props) {
  const whiteOpacity10 = addOpacityToColor("var(--white)", 0.1);
  const blueGrey400Opacity10 = addOpacityToColor("var(--blue-grey-400)", 0.5);

  function getBaseColor() {
    if (baseColor) return baseColor;

    if (variant === "grey") return blueGrey400Opacity10;

    return whiteOpacity10;
  }

  function getHighlightColor() {
    if (highlightColor) return highlightColor;

    if (variant === "grey") return "var(--grey-400)";

    return "var(--white)";
  }

  return (
    <SkeletonTheme
      baseColor={getBaseColor()}
      highlightColor={getHighlightColor()}
      borderRadius={borderRadius}
      width={width}
      height={height}
      inline={inline}
      duration={duration}
    >
      <Skeleton count={count} />
    </SkeletonTheme>
  );
}
