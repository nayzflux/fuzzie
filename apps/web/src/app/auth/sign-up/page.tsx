import Link from "next/link";
import SignUpForm from "~/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <p className="text-4xl font-bold">Sign Up</p>

        <p className="text-muted-foreground">
          Access your Fuzzie dashboard and take control of your integrations.{" "}
          <Link href="/auth/sign-in" className="underline">
            I already have an account
          </Link>
        </p>
      </div>

      {/* Form */}
      <SignUpForm />
    </div>
  );
}
