"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

type Note = {
  id: string;
  content: {
    html: string;
  };
};

export const NotesList = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const getNotes = () => {
    fetch("/api/notes", {
      method: "GET",
    })
      .then((res): Promise<Note[]> => res.json())
      .then((data) => {
        setNotes(data);
      });
  };

  useEffect(() => getNotes(), []);

  const deleteNote = (id: string) => {
    fetch("/api/notes/" + id, {
      method: "DELETE",
    }).then(() => {
      getNotes();
    });
  };

  return (
    <div>
      <h2>Notes List</h2>
      <div className="flex justify-between">
        <Link href="/notes/create">Create New</Link>
        <button onClick={getNotes}>Refresh</button>
      </div>
      <ul className="flex flex-col gap-2">
        {notes.map((note) => (
          <li className="flex justify-between border p-4" key={note.id}>
            <div dangerouslySetInnerHTML={{ __html: note.content.html }}></div>
            <div className="flex gap-2">
              <Link
                className="  bg-gray-200 p-2"
                href={`/notes/edit/${note.id}`}
              >
                Edit
              </Link>
              <button
                className="text-red-500 bg-gray-200 p-2"
                onClick={() => deleteNote(note.id)}
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
