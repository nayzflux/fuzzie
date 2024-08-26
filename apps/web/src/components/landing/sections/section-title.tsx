import { Heading } from "~/components/paragraphs/heading";
import { cn } from "~/lib/utils";

export default function SectionTitle({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:gap-4 text-center items-center",
        className
      )}
    >
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}

      <Heading as="h1">{title}</Heading>

      {/* <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-zinc-300 to-zinc-600 max-w-[500px]">
        {title}
      </h1> */}
    </div>
  );
}
