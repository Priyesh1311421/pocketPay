"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { Appbar } from "@repo/ui/appbar";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar(): JSX.Element {
  const router = useRouter();

  const userupdate = () => {
    router.push("/update-profile");
  };

  const home = () => {
    router.push("/");
  };

  const session = useSession();
  return <div className="z-10 sticky"><Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user} update={userupdate} home={home} /></div>;
};
