"use server"
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createName = async () => {   
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    let name = "";
    for(let i = 0; i < 5; i++){
        const random = Math.floor(Math.random()*26);
        name += alphabet[random];
    }
    for(let i = 0; i < 3; i++){
        const random = Math.floor(Math.random()*10);
        name += nums[random];
    }
    while(!uniquename(name)){
        for(let i = 0; i < 5; i++){
            const random = Math.floor(Math.random()*26);
            name += alphabet[random];
        }
        for(let i = 0; i < 3; i++){
            const random = Math.floor(Math.random()*10);
            name += nums[random];
        }
    }

    return name;
}

const uniquename = async (name: string) => {
    try {
        if(!name) return false;
        const user = await prisma.user.findUnique({
            where: {
                anonyName: name
            }
        });
        return user ? true : false;
    } catch (error) {
        throw new Error("Error generating anonymous name")
    } finally {
        prisma.$disconnect();
    }
}