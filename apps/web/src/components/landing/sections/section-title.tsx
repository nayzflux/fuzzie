export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-4 text-center items-center">
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-zinc-300 to-zinc-600 max-w-[500px]">
        {title}
      </h1>
    </div>
  );
}
