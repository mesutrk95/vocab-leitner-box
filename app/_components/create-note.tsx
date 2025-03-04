"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { LucideSave, LucideTrash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Note } from "@/types/note";
import { toast } from "sonner";

/* Using dynamic import of Jodit component as it can't render in server side*/
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export const CreateNote = ({
  noteId,
  placeholder,
}: {
  noteId?: string;
  placeholder?: string;
}) => {
  const router = useRouter();
  // const editor = useRef(null);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(!!noteId);

  const getNote = (noteId: string) => {
    fetch("/api/notes/" + noteId, {
      method: "GET",
    })
      .then((res): Promise<Note> => res.json())
      .then((data) => {
        setNote(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (noteId) getNote(noteId);
    else
      setNote({
        description: "string",
        moreDetail: "",
        formattedContent: {
          description: "",
          moreDetail: "",
        },
        title: "",
      });
  }, []);

  const deleteNote = () => {
    setLoading(true);
    fetch("/api/notes/" + noteId, {
      method: "DELETE",
    }).then(() => {
      router.push("/notes/");
    });
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "",
      height: 350,
    }),
    [placeholder]
  );

  const save = () => {
    setLoading(true);

    function extractTextFromHTML(htmlString: string) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");
      return doc.body.textContent || "";
    }

    fetch(noteId ? "/api/notes/" + noteId : "/api/notes/", {
      method: noteId ? "PUT" : "POST",
      body: JSON.stringify({
        title: note?.title,
        description: extractTextFromHTML(
          note?.formattedContent.description || ""
        ),
        moreDetail: extractTextFromHTML(
          note?.formattedContent.moreDetail || ""
        ),
        formattedContent: note?.formattedContent,
      }),
    })
      .then((res): Promise<Note> => res.json())
      .then((data) => {
        if (!noteId) router.push("/notes/edit/" + data.id);
        else {
          toast.success("Note updated!");
          setLoading(false);
        }
      });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="font-bold text-sm">Note Title</label>
        <Input
          value={note?.title}
          name="title"
          type="text"
          placeholder="Note title..."
          onChange={(e) =>
            note &&
            setNote({
              ...note,
              title: e.target.value,
            })
          }
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm  ">Description</label>
          <JoditEditor
            // ref={editor}
            value={note?.formattedContent.description}
            config={config}
            tabIndex={1} // tabIndex of textarea
            onBlur={(newContent) =>
              note &&
              setNote({
                ...note,
                formattedContent: {
                  ...note.formattedContent,
                  description: newContent,
                },
              })
            } // preferred to use only this option to update the content for performance reasons
            // onChange={(newContent) =>
            //   note &&
            //   setNote({
            //     ...note,
            //     content: { ...note.content, html: newContent },
            //   })
            // }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm">More Details</label>
          <JoditEditor
            // ref={editor}
            value={note?.formattedContent.moreDetail}
            config={config}
            tabIndex={1} // tabIndex of textarea
            onBlur={(newContent) =>
              note &&
              setNote({
                ...note,
                formattedContent: {
                  ...note.formattedContent,
                  moreDetail: newContent,
                },
              })
            } // preferred to use only this option to update the content for performance reasons
            // onChange={(newContent) =>
            //   note &&
            //   setNote({
            //     ...note,
            //     content: { ...note.content, html: newContent },
            //   })
            // }
          />
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <Button
          variant={"destructive"}
          className="flex gap-2"
          onClick={deleteNote}
          disabled={loading}
        >
          <LucideTrash size={16} />
          Delete
        </Button>
        <Button
          className="flex gap-2"
          onClick={() => setTimeout(save)}
          disabled={loading}
        >
          <LucideSave size={16} />
          Save
        </Button>
      </div>
    </div>
  );
};
