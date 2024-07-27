import Link from "next/link";
import SignInForm from "~/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-4xl font-bold">Sign In</p>

        <p className="text-muted-foreground">
          Access your Fuzzie dashboard and take control of your integrations.{" "}
          <Link href="/auth/sign-up" className="underline">
            I don&apos;t have an account
          </Link>
        </p>
      </div>

      {/* Form */}
      <SignInForm />
    </div>
  );
}
