import { currentUser } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const user = await currentUser();
  redirect('/notes')
  // return <Redirect;
}
