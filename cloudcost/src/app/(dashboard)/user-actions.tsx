"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignIn() {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => signIn("github")}
    >
      Sign in
    </Button>
  );
}

export function SignOut() {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => signOut()}
    >
      Sign out
    </Button>
  );
}
