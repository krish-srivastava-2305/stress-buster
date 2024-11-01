import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const DELETE = async(req: NextRequest): Promise<NextResponse> => {
    try {
        const token = req.cookies.get("accessToken")?.value as string | undefined
        const { postId } = await req.json();

        if(!token){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const decoded = jwt.decode(token) as {userId: string} | null

        if(!decoded){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        console.log(decoded)
        const userId = decoded.userId

        const post = await prisma.post.findFirst({
            where: {
                id: postId,
            }
        })

        if(!post){
            return NextResponse.json({error: "Post not found"}, {status: 404})
        }

        await prisma.post.delete({
            where: {
                id: postId
            }
        })

        return NextResponse.json({message: "Post deleted successfully"}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: "Server error while deleting Post"}, {status: 500})
    } finally {
        await prisma.$disconnect()
    }
}