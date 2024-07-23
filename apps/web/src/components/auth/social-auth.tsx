import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Button } from "~/components/ui/button";

const providers = [
  {
    id: "github",
    label: "Github",
    icon: FaGithub,
  },
];

export default function SocialAuth() {
  return (
    <div className="flex flex-col gap-4">
      {providers.map(({ id, label, icon: Icon }) => (
        <Button key={id} variant="outline" asChild>
          <Link href={`${process.env.API_URL}/auth/${id}`}>
            <Icon className="size-4 mr-2" />
            {label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
