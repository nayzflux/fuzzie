"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import plans from "~/data/plans.json";
import { useCurrentUser } from "~/hooks/use-current-user";

export default function SubscriptionPage() {
  const { data: user } = useCurrentUser();
  const [plan, setPlan] = useState(plans[0]);

  useEffect(() => {
    if (!user?.plan) return;
    const plan = plans.find((p) => p.id === user?.plan);
    if (!plan) return;
    setPlan(plan);
  }, [user?.plan]);

  return (
    <div className="flex flex-col w-full gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Current subscription</CardTitle>
          <CardDescription>
            Your subscription will be renewed on xxxx
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <p className="font-semibold text-4xl">{plan.label}</p>

          <div className="flex items-center gap-2">
            <p className="font-semibold text-4xl">
              {new Intl.NumberFormat("fr-fr", {
                style: "currency",
                currency: "EUR",
              }).format(plan.price)}
            </p>
            <p>/month</p>
          </div>
        </CardContent>

        <CardFooter>
          {!plan.isPremium ? (
            <Button className="ml-auto" asChild>
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL!}/checkout?planId=PRO`}
              >
                Upgrade to Pro Tier
              </Link>
            </Button>
          ) : (
            <Button className="ml-auto" variant="outline" asChild>
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL!}/users/${
                  user?.id
                }/customer-portal`}
              >
                Manage subscription
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing informations</CardTitle>
          <CardDescription>
            View and update your billing informations
          </CardDescription>
        </CardHeader>

        <CardFooter>
          <Button className="ml-auto" variant="outline" asChild>
            <Link
              href={`${process.env.API_URL!}/users/${user?.id}/customer-portal`}
            >
              Update billing informations
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing history</CardTitle>
          <CardDescription>View your billing history</CardDescription>
        </CardHeader>

        <CardFooter>
          <Button className="ml-auto" variant="outline">
            <Link
              href={`${process.env.API_URL!}/users/${user?.id}/customer-portal`}
            >
              See billing history
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {plan.isPremium && (
        <Card className="border-red-600">
          <CardHeader>
            <CardTitle>Cancel subscription</CardTitle>
            <CardDescription>
              Your subscription will remain active until its expiration.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button className="ml-auto" variant="destructive" asChild>
              <Link
                href={`${process.env.API_URL!}/users/${
                  user?.id
                }/customer-portal`}
              >
                Cancel subscription
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
