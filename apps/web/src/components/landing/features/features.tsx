import {
  ArrowPathIcon,
  PaperAirplaneIcon,
  QueueListIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { BentoCard, BentoGrid } from "../../magicui/bento-grid";
import { Logs } from "./logs";
import { Trigger } from "./trigger";
import { Retry } from "./retry";

const features = [
  {
    Icon: ShieldCheckIcon,
    name: "Robust Security",
    description: "Protect your endpoint with signature verification.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <div></div>,
  },
  {
    Icon: PaperAirplaneIcon,
    name: "Easy Event Trigger",
    description: "Trigger event directly from your code with zero overhead.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: <Trigger />,
  },
  {
    Icon: QueueListIcon,
    name: "Request Logs",
    description:
      "Monitor and inspect every webhook request with detailed logs.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: <Logs />,
  },
  {
    Icon: ArrowPathIcon,
    name: "Reliable Retry",
    description:
      "Ensure event deliverabilty with automatic and reliable retry system.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more",
    background: <Retry />,
  },
];

export default function Features() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
