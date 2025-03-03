import { Metadata } from "next";
import { CreateNote } from "@/app/_components/create-note"; 

export const metadata: Metadata = {
  title: "Edit Note",
};
 
export default async function EditNotePage({ params }: { params: { id: string } }) { 
  return <CreateNote noteId={params.id as string} />;
}
