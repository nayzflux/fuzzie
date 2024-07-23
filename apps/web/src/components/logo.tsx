import Image from "next/image";
import { cn } from "~/lib/utils";

export default function Logo({
  width = 32,
  height = 32,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      width={width}
      height={height}
      src="/logo.svg"
      alt="Fuzzie Logo"
      className={cn("size-12 rounded-lg", className)}
    />
  );
}
