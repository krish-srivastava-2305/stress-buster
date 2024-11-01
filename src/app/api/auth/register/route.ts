import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import { hash, genSalt } from "bcryptjs";
import { createName } from '@/util/createName';

const prisma = new PrismaClient();

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        // Parse and validate request data
        const { email, password, emergencyContact, dateOfBirth } = await req.json();
        if (!email || !password || !emergencyContact || !dateOfBirth) {
            return NextResponse.json({ error: "Please provide all fields" }, { status: 400 });
        }

        // Check if the email format is valid (basic regex pattern)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash the password
        const salt = await genSalt(10);
        const hashedPass = await hash(password, salt);

        // Set surveyDays to 7 days from current date
        const surveyDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const anonyName = await createName()

        // Generate tokens and check environment variables
        if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
            return NextResponse.json({ error: "Token secrets are not defined" }, { status: 500 });
        }

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPass,
                emergencyContact,
                // dateOfBirth: new Date(dateOfBirth), 
                dateOfBirth: dateOfBirth,
                surveyDays,
                anonyName
            }
        });

        console.log(newUser)
    
        const accessToken = jwt.sign(
            { userId: newUser.id, anonyName, surveyDays },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        const refreshToken = jwt.sign(
            { accessToken },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );
        
        await prisma.user.update({
            where: { id : newUser.id },
            data: { refreshToken }
        })

        // Set response with cookies
        const response = NextResponse.json({ message: "User Registered!", user: newUser }, { status: 200 });
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            path: "/",
        });
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
