import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) : Promise<NextResponse> => {
    try {
        const token = req.cookies.get("accessToken")?.value
        if (!token) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        const decoded = jwt.decode(token) as {id: string};
        if (!decoded) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            },
            select:{
                id: true,
                email: true,
                anonyName: true,
                emergencyContact: true,
                dateOfBirth: true,
                surveyDays: true,
                posts:{
                    select:{
                        id: true,
                        title: true,
                        content: true,
                        image: true,
                        createdAt: true
                    }
                },
                comments:{
                    select:{
                        id: true,
                        content: true,
                        createdAt: true,
                        post:{
                            select:{
                                id: true,
                                content: true,
                                image: true,
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        return NextResponse.json({user}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Error fetching user profile"}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }

}