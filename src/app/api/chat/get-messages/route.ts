import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { roomId } = await req.json();
        const token = req.cookies.get("accessToken");
        if(!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const decoded = jwt.decode(token.value) as { id: string };
        const user1Id = decoded.id;

        const room = await prisma.chatRoom.findFirst({
            where: { id: roomId },
            select:{
                id: true,
                users: {
                    select: {
                        id: true
                    }
                },
                messages: {
                    select: {
                        id: true,
                        content: true,
                        user: {
                            select: {
                                id: true,
                            }
                        },
                        createdAt: true
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }
        
        const messageMap = new Map();
        room.messages.forEach(message => {
            messageMap.set(message, message.id);
        });

        return NextResponse.json(messageMap, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error in Getting Messages" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}