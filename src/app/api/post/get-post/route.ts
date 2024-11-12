import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const url = req.nextUrl;
        const id = url.searchParams.get("id") as string | null; 
        if (!id) {
            return NextResponse.json({ error: "No post found" }, { status: 400 });
        }

        const post = await prisma.post.findUnique({
            where: {
                id: id
            }, select :{
                id: true,
                content: true,
                image: true,
                comments:{
                    select: {   
                        id: true,
                        content: true,
                        user: {
                            select: {
                                id: true,
                                anonyName: true,
                            }
                        }
                    }
                },
                likes: true,
                author: {
                    select: {
                        id: true,
                        anonyName: true,
                    }
                }
            }
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ post }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Error getting post" }, { status: 400 });
    }
    finally {
        await prisma.$disconnect();
    }
}