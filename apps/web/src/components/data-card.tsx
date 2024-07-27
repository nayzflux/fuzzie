import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import NumberTicker from "./magicui/number-ticker";

export default function DataCard({
  title,
  value,
  isPending,
}: {
  title: string;
  value: number;
  isPending?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>

        <CardTitle className="text-4xl">
          <NumberTicker value={value} />
        </CardTitle>
      </CardHeader>

      {/* <CardFooter>

      </CardFooter> */}
    </Card>
  );
}
