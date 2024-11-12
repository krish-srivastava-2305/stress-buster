import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { roomId, message } = await req.json()

        if (!roomId) {
            return NextResponse.json({ error: "Missing roomId" }, { status: 400 })
        }

        if (!message) {
            return NextResponse.json({ error: "Missing message" }, { status: 400 })
        }

        const token = req.cookies.get("accessToken")

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const decoded = jwt.decode(token.value) as { id: string, anonyName: string }
        const senderId = decoded.id

        const savedMessage = await prisma.message.create({
            data: {
                content: message,
                user:{
                    connect: {
                        id: senderId
                    }
                },
                chatRoom: {
                    connect: {
                        id: roomId
                    }
                }
            }
        })

        const users : string[] = roomId.split("__");
        const receiverId: string = users.find((user) => user !== senderId) as string

        await prisma.notification.create({
            data: {
                content: `New Message from ${decoded.anonyName}`,
                user: {
                    connect: {
                        id: receiverId
                    }
                },
            }
        })

        return NextResponse.json(savedMessage, { status: 201 })
        
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error in Saving Message" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}