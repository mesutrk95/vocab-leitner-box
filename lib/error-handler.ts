import { NextRequest, NextResponse } from "next/server";

export function withErrorHandling(
    handler: any//(req: NextRequest, context?: any) => Promise<NextResponse>
) {
    return async (req: NextRequest, context?: any) => {
        try {
            return await handler(req, context);
        } catch (error: any) {
            console.error("API Error:", error);

            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }
    };
}