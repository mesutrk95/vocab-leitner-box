import React from "react";
import { NotesList } from "../../_components/notes-list";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Notes",
};

export default async function Notes() {
  return <NotesList />;
}
