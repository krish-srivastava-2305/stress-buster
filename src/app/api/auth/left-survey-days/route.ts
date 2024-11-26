import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { id } = await req.json();

        const user = await prisma.user.findUnique({
            where: { id },
            select: { surveyDays: true }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ surveyDays: user.surveyDays });


    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    } 
}
