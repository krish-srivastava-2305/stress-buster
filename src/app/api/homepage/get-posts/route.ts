import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const GET = async(req: NextRequest): Promise<NextResponse> => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc"
            },
            select :{
                id: true,
                title: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        anonyName: true,
                    }
                },
                image: true
            }
        })
        
        if(!posts){
            return NextResponse.json({error: "No posts found"}, {status: 404})
        }

        return NextResponse.json({posts}, {status: 200});
    }
    catch (error) {
        return NextResponse.json({error: "Server error while loading Posts"}, {status: 500})
    } finally {
        await prisma.$disconnect()
    }
}