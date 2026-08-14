'use client'
import { useSession } from "next-auth/react"

export default function Signinpage() {
    const {data : session} = useSession()
    if(session){
    return (
        <div>
            <h1>Sign In</h1>
        </div>
    )
}
}

//this is the template that will be visible on the webstie 
