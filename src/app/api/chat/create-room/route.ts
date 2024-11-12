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

        const token = req.cookies.get("accessToken")?.value as string
        
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.decode(token) as { id: string };

        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user1Id = decoded.id;

        if (!user1Id) {
            return NextResponse.json({ error: "Id not found" }, { status: 400 });
        }

        const roomId = [user1Id, user2Id].sort().join("__");

        const existingRoom = await prisma.chatRoom.findFirst({where: {id: roomId}}); 

        if(existingRoom) {
            return NextResponse.json(existingRoom, { status: 202 });
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

        return NextResponse.json(room, { status: 200 });
        
    } catch (error) {
        console.log("Error in Joining Room: ", error);
        return NextResponse.json({ error: "Internal Server Error in Joining Room" }, { status: 500 });
        
    } finally {
        await prisma.$disconnect();
    }
}