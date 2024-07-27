"use client";

import { useParams } from "next/navigation";
import { useProjectApiKeys } from "~/hooks/use-project-api-keys";
import ApiKeysTable from "./api-keys-table";

export default function ApiKeysWrapper() {
  const { projectId } = useParams() as { projectId: string };
  const { data: apiKeys, isError, isPending } = useProjectApiKeys(projectId);

  if (isError) return <p>Error!</p>;

  if (isPending) return <p>Loading...</p>;

  if (apiKeys.length === 0) return <p>No API keys yet</p>;

  return <ApiKeysTable apikeys={apiKeys} />;
}
