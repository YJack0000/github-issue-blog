import { auth } from "@/config/auth";
import { SignIn, SignOut } from "@/components/AuthComponents";

export default async function UserButton() {
  const session = await auth();
  return session ? (
    <SignOut />
  ) : (
    <SignIn />
  );
}
