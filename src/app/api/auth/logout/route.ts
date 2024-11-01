import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) : Promise<NextResponse> => {
    try {
        const response = NextResponse.json({message: "Logged out"}, {status: 200});

        response.cookies.set("refreshToken", "", {maxAge: 0});
        response.cookies.set("accessToken", "", {maxAge: 0});

        return response;
    } catch (error) {
        return NextResponse.json({error: "Error Logging Out"}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}