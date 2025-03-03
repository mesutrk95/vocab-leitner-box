import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from 'next/server';


// GET /api/notes
export async function GET() {
    try {
        const notes = await db.note.findMany();
        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch notes' },
            { status: 500 }
        );
    }
}

// POST /api/notes
export async function POST(request: Request) {

    const session = await auth()
    try {
        const { content } = await request.json();
        const newNote = await db.note.create({
            data: {
                userId: session?.user.id!,
                content,
                createdAt: new Date(),
            },
        });
        return NextResponse.json(newNote, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create note' },
            { status: 500 }
        );
    }
}
