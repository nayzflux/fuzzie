"use client";

import dayjs from "dayjs";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card } from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

const chartConfig = {
  succeededCount: {
    label: "Succeeded",
    color: "#2563eb",
  },
  failedCount: {
    label: "Failed",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export default function WebhookRequestsChart({
  data,
  by,
}: {
  data: { succeededCount: number; failedCount: number; datetime: string }[];
  by: "DAY" | "HOUR" | "MINUTE";
}) {
  return (
    <Card className="p-6">
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            top: 20,
          }}
        >
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="datetime"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(datetime) => {
              if (by === "MINUTE") {
                return dayjs(datetime).format("HH:mm");
              }

              if (by === "HOUR") {
                return dayjs(datetime).format("HH:00");
              }

              return dayjs(datetime).format("DD/MM");
            }}
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Bar
            dataKey="succeededCount"
            fill="var(--color-succeededCount)"
            radius={8}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>

          <Bar dataKey="failedCount" fill="var(--color-failedCount)" radius={8}>
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
