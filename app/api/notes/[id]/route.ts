// import { auth } from "@/auth";
import { db } from "@/lib/db";
import { withErrorHandling } from "@/lib/error-handler";
import { NextResponse } from 'next/server';


// GET /api/notes/:id
export const GET = withErrorHandling(async (
    request: Request,
    { params }: { params: { id: string } }) => {

    const { id } = params;
    const notes = await db.note.findFirst({
        where: { id },
    });
    return NextResponse.json(notes);
})

// PUT /api/notes/:id
export const PUT = withErrorHandling(async (
    request: Request,
    { params }: { params: { id: string } }
) => {
    const { id } = params;
    const { formattedContent, description, moreDetails, title } = await request.json();
    const updatedNote = await db.note.update({
        where: { id },
        data: { description, moreDetails, formattedContent, title, updatedAt: new Date() },
    });
    return NextResponse.json(updatedNote);
})

// DELETE /api/notes/:id
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    await db.note.delete({
        where: { id },
    });
    return new NextResponse(null, { status: 204 });
}