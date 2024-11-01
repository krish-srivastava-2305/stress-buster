import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import {v2 as cloudinary} from 'cloudinary';
import jwt from 'jsonwebtoken';    

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryResponse {
    public_id: string;
    [key: string]: any;
}

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData(); 

        const title = formData.get("title") as string | undefined;
        const content = formData.get("content") as string | undefined;
        const image = formData.get("image") as File | undefined

        if(!title || !content || !image){
            return NextResponse.json({error: "Please provide all fields"},{
                status: 400,
            });
        }

        const accessToken = req.cookies.get("accessToken")?.value as string | undefined;

        if(!accessToken){
            return NextResponse.json({error: "Unauthorized"},{
                status: 401,
            });
        }
        
        const decoded = jwt.decode(accessToken) as {userId: string, anonyName: string, surveyDays: Date} | null;

        if(!decoded){
            return NextResponse.json({error: "Unauthorized"},{
                status: 401,
            });
        }

        const userId: string = decoded.userId

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        
        if(!user){
            return NextResponse.json({error: "Unauthorized"},{
                status: 401,
            });
        }

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const response = await new Promise<CloudinaryResponse> ((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type: "auto"}, (error, result) => {
                if(error){
                    reject(error);
                }else{
                    resolve(result as CloudinaryResponse);
                }
            }).end(buffer);
        })
        
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                image: response.url,
                author: {
                    connect: {
                        id: user.id
                    }
                },
            }
        })

        return NextResponse.json({message: "Post created successfully"},{
            status: 201,
        });

        
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Server Error creating post"},{
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}