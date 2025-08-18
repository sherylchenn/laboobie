import type { CategoryMeta } from "@/lib/category";
import { cn } from "@/lib/utils";

export function CategoryIcon({
  meta,
  size = 14,
  className,
}: {
  meta: CategoryMeta;
  size?: number;
  className?: string;
}) {
  const dimension = `${size}px`;
  if (meta.iconSrc) {
    return (
      <span
        className={cn("inline-block align-middle bg-current", className)}
        style={{
          width: dimension,
          height: dimension,
          WebkitMaskImage: `url(${meta.iconSrc})`,
          maskImage: `url(${meta.iconSrc})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    );
  }
  if (meta.Icon) {
    const Icon = meta.Icon;
    return <Icon className={cn("inline-block align-middle", className)} />;
  }
  return null;
}
