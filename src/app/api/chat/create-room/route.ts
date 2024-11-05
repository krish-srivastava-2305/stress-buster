import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { user2Id } = await req.json();

        if (!user2Id) {
            return NextResponse.json({ error: "Missing user2Id" }, { status: 400 });
        }

        const token = req.cookies.get("accessToken")
        
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.decode(token.value) as { id: string };
        const user1Id = decoded.id;
        const roomId = [user1Id, user2Id].sort().join("-");

        const existingRoom = await prisma.chatRoom.findFirst({where: {id: roomId}});  

        if(existingRoom) {
            return NextResponse.json(existingRoom, { status: 200 });
        }

        const room = await prisma.chatRoom.create({
            data: {
                id: roomId,
                users: {
                    connect: [
                        { id: user1Id },
                        { id: user2Id }
                    ]
                }
            }
        })
        return NextResponse.json(room, { status: 201 });
        
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error in Joining Room" }, { status: 500 });
        
    } finally {
        await prisma.$disconnect();
    }
}