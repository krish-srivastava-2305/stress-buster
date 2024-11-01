import { NextResponse, NextRequest } from "next/server"
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
        const { postId } = await req.json()

        console.log(userId, postId)

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        })

        if(!post){
            return NextResponse.json({error: "Post not found"}, {status: 404})
        }

        if(post.authorId === userId){
            return NextResponse.json({error: "Cannot like your own post"}, {status: 400})
        }

        const alreadyLiked = await prisma.post.findFirst({
            where: {
                id: postId,
                likedBy: {
                    some: {
                        id: userId
                    }
                }
            }
        })

        if(alreadyLiked){
            const updatedPost = await prisma.post.update({
                where: {
                    id: postId
                },
                data: {
                    likes: {decrement: 1},
                    likedBy: {
                        disconnect: {
                            id: userId
                        }
                    }
                }
            })
            return NextResponse.json({message: "Post disliked"}, {status: 200})
        } else {
            const updatedPost = await prisma.post.update({
                where: {
                    id: postId
                },
                data: {
                    likes: {increment: 1},
                    likedBy: {
                        connect: {
                            id: userId
                        }
                    }
                }
            })
            return NextResponse.json({message: "Post liked"}, {status: 200})
        }
        
    } catch (error) {
        return NextResponse.json({error: "Server error while liking post"}, {status: 500})
    } finally{
        await prisma.$disconnect()
    }
}