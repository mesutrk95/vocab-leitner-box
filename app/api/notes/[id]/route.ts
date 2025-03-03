// import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from 'next/server';


// GET /api/notes/:id
export async function GET(
    request: Request,
    { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const notes = await db.note.findFirst({
            where: { id },
        });
        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch note' },
            { status: 500 }
        );
    }
}

// PUT /api/notes/:id
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { content } = await request.json();
        const updatedNote = await db.note.update({
            where: { id },
            data: { content },
        });
        return NextResponse.json(updatedNote);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update note' },
            { status: 500 }
        );
    }
}

// DELETE /api/notes/:id
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        console.log(id);

        await db.note.delete({
            where: { id },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete note' },
            { status: 500 }
        );
    }
}