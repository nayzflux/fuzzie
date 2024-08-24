"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EventsChart from "~/components/charts/events-chart";
import WebhookRequestsChart from "~/components/charts/webhook-requets-chart";
import DataCard from "~/components/data-card";
import TimeRangeSelect from "~/components/timerange-select";
import { Separator } from "~/components/ui/separator";
import { api } from "~/lib/api";

export default function ProjectPage() {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const queryClient = useQueryClient();

  const [from, setFrom] = useState(
    Math.floor(Date.now() / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000) -
      7 * 24 * 60 * 60 * 1000
  );
  const [to, setTo] = useState(Date.now());
  const [by, setBy] = useState<"DAY" | "HOUR" | "MINUTE">("DAY");

  const [timerange, setTimerange] = useState<string>("7d");

  const { data, isPending } = useQuery({
    queryKey: ["analytics", projectId],
    queryFn: async () => {
      const res = await api.get(
        `projects/${projectId}/analytics?from=${from}&to=${to}&by=${by}`
      );
      const project = (await res.json()) satisfies {
        allTimeEventCount: number;
        monthlyEventCount: number;
        allTimeWebhookRequestCount: number;
        monthlyWebhookRequestCount: number;
        events: {
          eventCount: number;
          datetime: string;
        }[];
        webhookRequests: {
          succeededCount: number;
          failedCount: number;
          datetime: string;
        }[];
      };
      return project;
    },
  });

  useEffect(() => {
    switch (timerange) {
      case "60m":
        setFrom(Date.now() - 60 * 60 * 1000);
        setTo(Date.now());
        setBy("MINUTE");
        break;
      case "12h":
        setFrom(Date.now() - 12 * 60 * 60 * 1000);
        setTo(Date.now());
        setBy("HOUR");
        break;
      case "24h":
        setFrom(Date.now() - 24 * 60 * 60 * 1000);
        setTo(Date.now());
        setBy("HOUR");
        break;
      case "7d":
        setFrom(
          Math.floor(Date.now() / (24 * 60 * 60 * 1000)) *
            (24 * 60 * 60 * 1000) -
            7 * 24 * 60 * 60 * 1000
        );
        setTo(Date.now());
        setBy("DAY");
        break;
      case "15d":
        setFrom(
          Math.floor(Date.now() / (24 * 60 * 60 * 1000)) *
            (24 * 60 * 60 * 1000) -
            15 * 24 * 60 * 60 * 1000
        );
        setTo(Date.now());
        setBy("DAY");
        break;
      case "30d":
        setFrom(
          Math.floor(Date.now() / (24 * 60 * 60 * 1000)) *
            (24 * 60 * 60 * 1000) -
            30 * 24 * 60 * 60 * 1000
        );
        setTo(Date.now());
        setBy("DAY");
        break;
      case "60d":
        setFrom(
          Math.floor(Date.now() / (24 * 60 * 60 * 1000)) *
            (24 * 60 * 60 * 1000) -
            60 * 24 * 60 * 60 * 1000
        );
        setTo(Date.now());
        setBy("DAY");
        break;
      case "90d":
        setFrom(
          Math.floor(Date.now() / (24 * 60 * 60 * 1000)) *
            (24 * 60 * 60 * 1000) -
            90 * 24 * 60 * 60 * 1000
        );
        setTo(Date.now());
        setBy("DAY");
        break;
    }
  }, [timerange]);

  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ["analytics", projectId] });

    return () => {
      queryClient.cancelQueries({ queryKey: ["analytics", projectId] });
    };
  }, [from, to, by]);

  return (
    <div className="flex flex-col gap-8">
      {/* Project Usage */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Event triggered all time */}
        <DataCard title="Total Events" value={data?.allTimeEventCount || 0} />

        {/* Webhook requests all time */}
        <DataCard
          title="Total Requests"
          value={data?.allTimeWebhookRequestCount || 0}
        />

        {/* Event triggered monthly */}
        <DataCard
          title={`Events triggered in ${dayjs().format("MMMM")}`}
          value={data?.monthlyEventCount || 0}
        />

        {/* Webhook request monthly */}
        <DataCard
          title={`Requests sent in ${dayjs().format("MMMM")}`}
          value={data?.monthlyWebhookRequestCount || 0}
        />
      </div>

      <Separator />

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <p className="font-semibold text-2xl">Events</p>

          <div className="ml-auto">
            <TimeRangeSelect value={timerange} onValueChange={setTimerange} />
          </div>
        </div>

        <EventsChart by={by} data={data?.events || []} />
      </div>

      <Separator />

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <p className="font-semibold text-2xl">Webhook requests</p>

          <div className="ml-auto">
            <TimeRangeSelect value={timerange} onValueChange={setTimerange} />
          </div>
        </div>

        <WebhookRequestsChart by={by} data={data?.webhookRequests || []} />
      </div>
    </div>
  );
}
