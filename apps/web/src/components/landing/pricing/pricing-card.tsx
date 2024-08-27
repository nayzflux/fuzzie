import { CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { MagicCard } from "~/components/magicui/magic-card";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const PricingCard = ({
  title,
  description,
  price,
  cta,
  features,
  isPrimary,
  isPremium,
  id,
}: {
  title: string;
  description: string;
  price: number;
  cta: string;
  features: string[];
  isPrimary?: boolean;
  id: string;
  isPremium: boolean;
}) => {
  return (
    <MagicCard
      className="cursor-pointer p-8 bg-opacity-30"
      gradientColor={"#262626"}
    >
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-semibold">{title}</p>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8">
          <div className="flex gap-2 items-end">
            <p className="text-5xl font-extrabold">
              {new Intl.NumberFormat("fr-fr", {
                style: "currency",
                currency: "EUR",
              }).format(price)}
            </p>
            <p className="text-sm text-muted-foreground">/month</p>
          </div>

          <Button
            asChild
            className={cn(
              "w-full",
              isPrimary &&
                "bg-violet-700 hover:bg-violet-900 transition-all ease-out duration-500 text-white"
            )}
          >
            <Link
              href={
                isPremium
                  ? `${process.env.NEXT_PUBLIC_API_URL!}/checkout?planId=${id}`
                  : "/app"
              }
            >
              {cta}
            </Link>
          </Button>

          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              What&apos;s included:
            </p>

            <div className="flex flex-col gap-2">
              {features.map((feature) => (
                <div key={feature} className="flex">
                  <CheckIcon className="size-4 mr-2 text-green-500" />
                  <p className="text-sm text-semibold">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MagicCard>
  );
};
