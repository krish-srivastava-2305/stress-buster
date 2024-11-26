import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const middleware = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const path = req.nextUrl.pathname;
        const token = req.cookies.get("accessToken")?.value;

        if (path === "/" && !token) {
            return NextResponse.next();
        }

        if (!token) {
            console.log("No token found, redirecting to public page");
            return NextResponse.redirect(new URL("/", req.url));
        }

        if(path === "/") {
            return NextResponse.redirect(new URL("/homepage", req.url));
        }

        let decoded;
        try {
            decoded = jwt.decode(token) as { id: string };
        } catch (err) {
            console.log("Token verification failed:", err);
            return NextResponse.redirect(new URL("/", req.url));
        }

        const apiUrl = `${req.nextUrl.origin}/api/auth/left-survey-days`;

        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: decoded.id }),
        });

        if (!res.ok) {
            console.error("Error fetching survey days.");
            return NextResponse.json({ error: "Could not fetch survey days" }, { status: 500 });
        }

        const { surveyDays } = await res.json();
        const lastSurveyDate = new Date(surveyDays);
        const today = new Date(Date.now());

        const diffInMs = lastSurveyDate.getTime() - today.getTime();
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        if (surveyDays === -1) {
            console.error("Error fetching survey days.");
            return NextResponse.json({ error: "Could not fetch survey days" }, { status: 500 });
        }

        if (diffInDays <= 0) {
            console.log("Redirecting to survey");
            return NextResponse.redirect(new URL("/survey", req.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};


export const config = {
    matcher: [
        "/",                     // Public route
        "/homepage",             // Private route
        "/chat",                 // Private route
        "/notification",         // Private route
        "/profile",              // Private route
        "/post/:path*",          // Private route with dynamic segments
    ],
};
