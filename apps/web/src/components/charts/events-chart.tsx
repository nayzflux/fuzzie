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
  eventCount: {
    label: "Triggered",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function EventsChart({
  data,
  by,
}: {
  data: { eventCount: number; datetime: string }[];
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

          <Bar dataKey="eventCount" fill="var(--color-eventCount)" radius={8}>
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
