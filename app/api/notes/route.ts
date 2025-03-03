import { auth } from "@/auth";
import { db } from "@/lib/db";
import { withErrorHandling } from "@/lib/error-handler";
import { NextResponse } from 'next/server';


// GET /api/notes
export const GET = withErrorHandling(async () => {
    const notes = await db.note.findMany();
    return NextResponse.json(notes);
})

// POST /api/notes
export const POST = withErrorHandling(async (request: Request) => {
    const session = await auth()
    const { content } = await request.json();
    const newNote = await db.note.create({
        data: {
            userId: session?.user.id!,
            content,
            createdAt: new Date(),
        },
    });
    return NextResponse.json(newNote, { status: 201 });
})