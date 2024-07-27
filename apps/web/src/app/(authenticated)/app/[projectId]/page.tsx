import dayjs from "dayjs";
import EventsChart from "~/components/charts/events-chart";
import WebhookRequestsChart from "~/components/charts/webhook-requets-chart";
import DataCard from "~/components/data-card";
import TimeRangeSelect from "~/components/timerange-select";
import { Separator } from "~/components/ui/separator";

export default function ProjectPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Project Usage */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Event triggered all time */}
        <DataCard title="Total Events" value={137} />

        {/* Webhook requests all time */}
        <DataCard title="Total Requests succeeded" value={137} />

        {/* Event triggered monthly */}
        <DataCard
          title={`Events triggered in ${dayjs().format("MMMM")}`}
          value={83}
        />

        {/* Webhook request all time */}
        <DataCard
          title={`Requests succeeded in ${dayjs().format("MMMM")}`}
          value={83}
        />
      </div>

      <Separator />

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <p className="font-semibold text-2xl">Events</p>

          <div className="ml-auto">
            <TimeRangeSelect />
          </div>
        </div>

        <EventsChart data={[]} />
      </div>

      <Separator />

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <p className="font-semibold text-2xl">Webhook requests</p>

          <div className="ml-auto">
            <TimeRangeSelect />
          </div>
        </div>

        <WebhookRequestsChart data={[]} />
      </div>
    </div>
  );
}
