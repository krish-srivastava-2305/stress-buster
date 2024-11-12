import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
    try {
        const token = req.cookies.get("accessToken")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.decode(token) as { id: string, anonyName: string };
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const userId = decoded.id;

        console.log(userId)

        const notifications = await prisma.notification.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(notifications, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Server Error in getting Notifications" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}