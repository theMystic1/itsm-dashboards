"use client";
import dynamic from "next/dynamic";

// If the user component or any of its children use DOM on import,
// load it dynamically so it only runs in the browser.
const UserLanding = dynamic(() => import("@/components/user"), { ssr: false });

export default function HomeClient() {
  return <UserLanding />;
}
