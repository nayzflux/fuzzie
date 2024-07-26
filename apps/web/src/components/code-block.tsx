import { Card } from "./ui/card";

export default function CodeBlock({ code }: { code: unknown }) {
  return (
    <Card className="p-4">
      <pre>{JSON.stringify(code)}</pre>
    </Card>
  );
}
