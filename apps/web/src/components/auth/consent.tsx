import Link from "next/link";

export default function Consent() {
  return (
    <div className="flex items-center justify-center">
      <p className="text-center text-sm text-muted-foreground py-8 max-w-[400px]">
        By continuing, you agree to Fuzzie's{" "}
        <Link href="/terms-of-service" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
