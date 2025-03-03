import React from "react";

import { Metadata } from "next";
import { CreateNote } from "@/app/_components/create-note";

export const metadata: Metadata = {
  title: "Create a Note",
};

export default async function CreateNotePage() {
  return (
    <div>
      <CreateNote />
    </div>
  );
}
