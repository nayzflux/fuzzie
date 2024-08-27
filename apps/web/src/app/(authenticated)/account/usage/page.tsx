"use client";

import { useEffect, useState } from "react";
import plans from "~/data/plans.json";
import { useCurrentUser } from "~/hooks/use-current-user";
import { UsageCard, UsageCardLoading } from "./usage-card";

const UsagePage = () => {
  const { data, isPending } = useCurrentUser();
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    const plan = plans.find((p) => p.id === data?.plan);
    setPlan(plan);
  }, [data]);

  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {/* Events */}
      {isPending ? (
        <UsageCardLoading />
      ) : (
        <UsageCard
          title="Events triggered"
          value={data?.eventUsageCount || 1}
          maxValue={plan?.maxEvents || 1}
        />
      )}

      {/* Requests */}
      {isPending ? (
        <UsageCardLoading />
      ) : (
        <UsageCard
          title="Webhook requests"
          value={data?.webhookRequestUsageCount || 1}
          maxValue={plan?.maxWebhookRequests || 1}
        />
      )}
    </div>
  );
};

export default UsagePage;
