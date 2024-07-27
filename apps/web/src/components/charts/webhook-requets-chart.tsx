"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card } from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
const chartData = [
  { date: "January", succeeded: 34, failed: 1 },
  { date: "February", succeeded: 31, failed: 2 },
  { date: "March", succeeded: 26, failed: 1 },
  { date: "April", succeeded: 24, failed: 3 },
  { date: "May", succeeded: 41, failed: 2 },
  { date: "June", succeeded: 24, failed: 3 },
];

const chartConfig = {
  succeeded: {
    label: "Succeeded",
    color: "#2563eb",
  },
  failed: {
    label: "Failed",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export default function WebhookRequestsChart({
  data,
}: {
  data: { succeeded: number; failed: number; date: string }[];
}) {
  return (
    <Card className="p-6">
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20,
          }}
        >
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Bar dataKey="succeeded" fill="var(--color-succeeded)" radius={8}>
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>

          <Bar dataKey="failed" fill="var(--color-failed)" radius={8}>
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
