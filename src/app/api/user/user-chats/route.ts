import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const url = req.nextUrl
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                chatRooms:{
                    select:{
                        id:true,
                        users: true,
                }
            }
        }});

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let receivers : Array<string> = [];
        const chatRooms = user.chatRooms;
        if (!chatRooms) {
            return NextResponse.json({ error: "No Chat Rooms found" }, { status: 203 });
        }
        chatRooms.forEach((chat) => {
            for (let i = 0; i < chat.users.length; i++) {
                if (chat.users[i].id === id) {
                    continue;
                }
                receivers.push(chat.users[i].anonyName);
            }
        });
        return NextResponse.json({ receivers, chatRooms }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error in getting chats" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }

}