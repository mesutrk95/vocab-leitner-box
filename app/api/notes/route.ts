import { auth } from "@/auth";
import { db } from "@/lib/db";
import { withErrorHandling } from "@/lib/error-handler";
import { NextResponse } from 'next/server';

export const GET = withErrorHandling(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
        db.note.findMany({
            where: search ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            } : {},
            orderBy: { id: 'desc' },
            skip,
            take: limit,
        }),
        db.note.count({
            where: search ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            } : {}
        }),
    ]);

    return NextResponse.json({ notes, total, page });
})

// POST /api/notes
export const POST = withErrorHandling(async (request: Request) => {
    const session = await auth()
    const { formattedContent, description, moreDetails, title } = await request.json();
    const newNote = await db.note.create({
        data: {
            userId: session?.user.id!,
            title,
            formattedContent, description, moreDetails,
            createdAt: new Date(),
        },
    });
    return NextResponse.json(newNote, { status: 201 });
})