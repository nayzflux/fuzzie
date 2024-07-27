import AddApiKeyDialog from "./add-api-key-dialog";
import ApiKeysWrapper from "./api-keys-wrapper";

export default function ApiKeysPage() {
  return (
    <div className="flex flex-col  gap-8 w-full">
      <div className="flex items-center gap-4">
        <p className="text-2xl font-semibold">API keys</p>

        <div className="ml-auto">
          <AddApiKeyDialog />
        </div>
      </div>

      <ApiKeysWrapper />
    </div>
  );
}
