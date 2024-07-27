import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const ranges = [
  {
    label: "Last 90 days",
    value: "90d",
  },
  {
    label: "Last 60 days",
    value: "60d",
  },
  {
    label: "Last 30 days",
    value: "30d",
  },
  {
    label: "Last 15 days",
    value: "15d",
  },
  {
    label: "Last 7 days",
    value: "7d",
  },
  {
    label: "Last 24 hours",
    value: "24h",
  },
  {
    label: "Last 12 hours",
    value: "12h",
  },
  {
    label: "Last 60 minutes",
    value: "60m",
  },
];

export default function TimeRangeSelect() {
  return (
    <Select defaultValue="7d">
      <SelectTrigger>
        <SelectValue placeholder="Select timerange" />
      </SelectTrigger>
      <SelectContent>
        {ranges.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
