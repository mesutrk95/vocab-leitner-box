"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  LucideEdit2,
  LucidePlus,
  LucideRefreshCw,
  LucideTrash,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { Note } from "@/types/note";
import { useDebounce } from "../hooks/useDebounce";

type NotesListProps = {
  notes: Note[];
  total: number;
};

export const NotesList = () => {
  const [notes, setNotes] = useState<NotesListProps>({ notes: [], total: 0 });
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const getNotes = () => {
    fetch(`/api/notes?page=${page}&search=${debouncedSearch}`, {
      method: "GET",
    })
      .then((res): Promise<NotesListProps> => res.json())
      .then((data) => {
        setNotes(data);
      });
  };

  useEffect(() => getNotes(), [page, debouncedSearch]);

  const deleteNote = (id: string) => {
    fetch("/api/notes/" + id, {
      method: "DELETE",
    }).then(() => {
      getNotes();
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-5">Notes List</h2>
      <div className="flex justify-between mb-2">
        <div className="">
          <Input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button asChild variant={"secondary"}>
            <Link className="flex gap-2 " href="/notes/create">
              <LucidePlus size={16} />
              Create New
            </Link>
          </Button>

          <Button variant={"outline"} onClick={getNotes}>
            <LucideRefreshCw size={16} />
          </Button>
        </div>
      </div>
      <ul className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-2">
        {notes.notes.map((note) => (
          <div
            className="flex flex-col justify-between border rounded p-3 gap-4"
            key={note.id}
          >
            <div className="h-[50px] overflow-hidden relative">
              <div
                dangerouslySetInnerHTML={{
                  __html: note.formattedContent.description || "",
                }}
              ></div>
              <div
                className="absolute bottom-0 w-full h-[30px] z-1 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, transparent, white)",
                }}
              ></div>
            </div>
            <div className="flex justify-between gap-2">
              <div className="flex flex-col">
                <Moment
                  className="text-slate-500 text-xs  "
                  format="YYYY/MM/DD HH:mm"
                >
                  {note.createdAt}
                </Moment>
                <Moment className="text-slate-500 text-xs" fromNow>
                  {note.createdAt}
                </Moment>
              </div>
              <div className="flex gap-2">
                <Button size="sm" asChild variant={"outline"}>
                  <Link className="flex gap-2" href={`/notes/edit/${note.id}`}>
                    <LucideEdit2 size={16} />
                    Edit
                  </Link>
                </Button>
                <Button
                  className="flex gap-2"
                  variant={"outline"}
                  size="sm"
                  onClick={() => note.id && deleteNote(note.id)}
                >
                  <LucideTrash size={16} />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </ul>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            {page !== 1 && (
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              />
            )}
          </PaginationItem>
          {/* <PaginationItem>page</PaginationItem> */}
          <PaginationItem>
            {page !== notes.total && (
              <PaginationNext
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, notes.total))
                }
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
