'use server'
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getUserId = async () => {
  const cookieStore = await cookies();
  if(cookieStore) {
    const token = cookieStore.get('accessToken')?.value as string
    if(!token){
      return null
    }
    const decoded = jwt.decode(token) as {id: string}
    if(!decoded){
      return null
    }
    return decoded.id
  }
  return null
}