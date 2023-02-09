import { grey400, white } from "@/constants";
import { addOpacityToHsl } from "@/helpers";
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
  borderRadius = 4,
  inline = true,
  duration,
}: Props) {
  const whiteOpacity10 = addOpacityToHsl(white, 0.1);
  const grey400Opacity10 = addOpacityToHsl(grey400, 0.1);

  function getBaseColor() {
    if (baseColor) return baseColor;

    if (variant === "grey") return grey400Opacity10;

    return whiteOpacity10;
  }

  function getHighlightColor() {
    if (highlightColor) return highlightColor;

    if (variant === "grey") return grey400;

    return white;
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
