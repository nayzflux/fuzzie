import Image from "next/image";

export default function Logo() {
  return (
    <Image
      width={48}
      height={48}
      src="/logo.svg"
      alt="Fuzzie Logo"
      className="size-12 rounded-lg"
    />
  );
}
