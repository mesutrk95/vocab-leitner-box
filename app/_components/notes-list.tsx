"use client";

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
      <ul className="flex flex-col gap-2">
        {notes.map((note) => (
          <li className="flex justify-between border p-4" key={note.id}>
            <div dangerouslySetInnerHTML={{ __html: note.content.html }}></div>
            <button
              className="text-red-500 bg-gray-100 p-2"
              onClick={() => deleteNote(note.id)}
            >
                X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
