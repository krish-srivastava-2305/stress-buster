import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async (req: NextRequest) : Promise<NextResponse> => {
    try {

        const { text, score } : { text: string, score: number } = await req.json()

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const token = req.cookies.get("accessToken")?.value;

        if (!token) {
            return NextResponse.redirect('/');
        }

        const decoded = jwt.decode(token) as { id: string };

        if (!decoded) {
            return NextResponse.redirect('/');
        }

        const survey = await prisma.survey.create({
            data:  {
                user: {
                    connect :{ 
                        id : decoded.id
                    }
                },
                responses: text,
                score
            }
        });

        await prisma.user.update({
            where: {id: decoded.id},
            data: {
                surveyDays: new Date(Date.now() + 7*24*60*60*1000),
                surveys: {
                    connect: {
                        id: survey.id
                    }   
                }
            }
        })

        return NextResponse.json({ success: "Survey submitted" }, {status: 200});   
        
    } catch (error) {
        return NextResponse.json({ error: "Could not submit survey" }, { status: 500 });
    } finally {
        await prisma.$disconnect()
    }

}