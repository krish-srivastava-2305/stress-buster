import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const POST = async(req: NextRequest): Promise<NextResponse> => {
    try {
        const token = req.cookies.get("accessToken")?.value as string | undefined
        if(!token){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const decoded = jwt.decode(token) as {id: string} | null

        if(!decoded){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const userId = decoded.id as string

        const { postId, content } = await req.json()

        console.log(postId, content)

        if(!postId || !content){
            return NextResponse.json({error: "Please provide all fields"}, {status: 400})
        }

        if(content.trim === ""){
            return NextResponse.json({error: "Comment cannot be empty"}, {status: 400})
        }

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        })

        if(!post){
            return NextResponse.json({error: "Post not found"}, {status: 404})
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                post: {
                    connect:{
                        id: postId
                    }
                },
                user:{
                    connect:{
                        id: userId
                    }
                }
            }
        })

        const newComment = await prisma.comment.findUnique({
            where: { id: comment.id },
            select: {
                id: true,
                content: true,
                user: {
                    select: {
                        id: true,
                        anonyName: true
                    }
                }   
            }
        })

        await prisma.notification.create({
            data: {
                user: {
                    connect: {
                        id: post.authorId
                    }
                },
                content: `${newComment?.user.anonyName} commented on your post`,
            }
        })

        return NextResponse.json({comment: newComment}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: "Server error while commenting"}, {status: 500})
    } finally {
        await prisma.$disconnect()
    }
}