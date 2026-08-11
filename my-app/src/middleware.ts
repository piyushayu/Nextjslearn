import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware"

import { getToken } from "next-auth/jwt";
// to get the token we have to import this everytime

export async function middleware (request : NextRequest){

    const token = await getToken({req : request })    
    const url = request.nextUrl
    // to check which url is user is currently on

    if(token && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up'))){
        return NextResponse.redirect(new URL('/dashboard' , request.url))
    }

    // we can add pathname on base of our requirement 

    return NextResponse.redirect(new URL('/home' , request.url))
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







