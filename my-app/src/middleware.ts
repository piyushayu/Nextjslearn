import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware"

import { getToken } from "next-auth/jwt";
// to get the token we have to import this everytime

export async function middleware (request : NextRequest){

    const token = await getToken({req : request })    
    const url = request.nextUrl
    // to check which url is user is currently on

    if(token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/'
    )){
        return NextResponse.redirect(new URL('/dashboard' , request.url))
    }

    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/sign-in' , request.url))
    }

    // return NextResponse.redirect(new URL('/home' , request.url))
    return NextResponse.next()
}

export const config = {
    matcher : ["/sign-in",
        "/dashboard/:path*",
        "/sign-up",
        "/verify/:path*",    
    ]
}


// path* means is main route kai andar jitna bhi chota path ya fhir route hai 
// un sab pai middleware laga do 







