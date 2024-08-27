"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Skeleton } from "~/components/ui/skeleton";

export const UsageCard = ({
  title,
  value,
  maxValue,
}: {
  title: string;
  value: number;
  maxValue: number;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>

        <CardTitle className="text-4xl">
          {value} / {maxValue}
        </CardTitle>
      </CardHeader>

      <CardFooter>
        <Progress value={(value / maxValue) * 100} />
      </CardFooter>
    </Card>
  );
};

export const UsageCardLoading = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-40 h-5" />

        <Skeleton className="w-60 h-9" />
      </CardHeader>

      <CardFooter>
        <Skeleton className="w-40 h-2" />
      </CardFooter>
    </Card>
  );
};
