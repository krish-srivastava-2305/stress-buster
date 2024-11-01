import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const GET = async(req: NextRequest): Promise<NextResponse> => {
    try {
        const token = req.cookies.get("accessToken")?.value as string | undefined;
        if(!token){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const decoded = jwt.decode(token) as {userId: string} | null;

        if(!decoded){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const userId = decoded.userId;

        const posts = await prisma.post.findMany({
            where: {
                authorId: userId
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                title: true,
                content: true,
                image: true,
            }
        });

        return NextResponse.json({posts}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Server error while loading Posts"}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}