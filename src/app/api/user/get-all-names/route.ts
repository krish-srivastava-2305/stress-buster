import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const allUsers = await prisma.user.findMany({
            select: {
                anonyName: true
            }
        });

        return NextResponse.json(allUsers);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching user names" }, { status: 500 });
    }
};