"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Note = {
  id?: string;
  content: {
    html: string;
    responseHtml: string;
  };
};

export const CreateNote = ({
  noteId,
  placeholder,
}: {
  noteId?: string;
  placeholder?: string;
}) => {
  const router = useRouter();
  const editor = useRef(null);
  const [note, setNote] = useState<Note | null>(null);

  const getNote = (noteId: string) => {
    fetch("/api/notes/" + noteId, {
      method: "GET",
    })
      .then((res): Promise<Note> => res.json())
      .then((data) => {
        setNote(data);
      });
  };

  useEffect(() => {
    if (noteId) getNote(noteId);
    else setNote({ content: { html: "", responseHtml: "" } });
  }, []);

  const deleteNote = () => {
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
    fetch(noteId ? "/api/notes/" + noteId : "/api/notes/", {
      method: noteId ? "PUT" : "POST",
      body: JSON.stringify({
        content: {
          html: note?.content.html,
          responseHtml: note?.content.responseHtml,
        },
      }),
    })
      .then((res): Promise<Note> => res.json())
      .then((data) => {
        setNote(data);
        router.push("/notes/edit/" + data.id);
      });
  };

  return (
    <div>
      <Link href="/notes">All Notes</Link>
      <div className="flex gap-5 mb-5">
        <div>
          <JoditEditor
            ref={editor}
            value={note?.content.html}
            config={config}
            tabIndex={1} // tabIndex of textarea
            onBlur={(newContent) =>
              note &&
              setNote({
                ...note,
                content: { ...note.content, html: newContent },
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
        <div>
          <JoditEditor
            ref={editor}
            value={note?.content.responseHtml}
            config={config}
            tabIndex={1} // tabIndex of textarea
            onBlur={(newContent) =>
              note &&
              setNote({
                ...note,
                content: { ...note.content, responseHtml: newContent },
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
        <button className="p-3 bg-red-100" onClick={deleteNote}>
          Delete
        </button>
        <button className="p-3 bg-gray-100" onClick={() => setTimeout(save)}>
          Save
        </button>
      </div>
    </div>
  );
};
