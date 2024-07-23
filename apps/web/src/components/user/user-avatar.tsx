import Image from "next/image";
import { cn } from "~/lib/utils";
import { CurrentUser } from "~/types/user";

export default function UserAvatar({
  user,
  width = 32,
  height = 32,
  className,
}: {
  user?: CurrentUser;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <Image
      width={width}
      height={height}
      src={`https://avatar.vercel.sh/${user?.id}`}
      className={cn("size-8 rounded-full", className)}
      alt="User avatar"
    />
  );
}
