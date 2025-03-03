import { GET as getRoute, POST as postRoute } from "@/auth";
import { withErrorHandling } from "@/lib/error-handler";

export const GET = withErrorHandling(getRoute)
export const POST = withErrorHandling(postRoute)