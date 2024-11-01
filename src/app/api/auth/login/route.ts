import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) : Promise<NextResponse> => {
    try {
        const { email, password } = await req.json();
        if(!email || !password){
            return NextResponse.json({error: "Please provide all fields"}, {status: 400});
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                anonyName: true,
                surveyDays: true,
            }
        })

        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const valid = await compare(password, user.password);

        if(!valid){
            return NextResponse.json({error: "Invalid Password"}, {status: 401});
        }

        if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const accessToken = jwt.sign(
            { id: user.id ,email, anonyName: user.anonyName, surveyDays: user.surveyDays },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "1d" }
        );
        const refreshToken = jwt.sign({accessToken}, process.env.REFRESH_TOKEN_SECRET!, {expiresIn: "7d"});

        const response =  NextResponse.json({ user, message: "User logged in" }, {status: 200});

        response.cookies.set("refreshToken", refreshToken);
        response.cookies.set("accessToken", accessToken);

        return response;

    } catch (error) {
        return NextResponse.json({error: "Error Logging In"}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }

}