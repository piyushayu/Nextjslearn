"use client"

import { User } from "next-auth"
import { useSession ,signOut } from "next-auth/react"
import Link from "next/link"

export const Navbar = () => {

    const {data : session} = useSession()

    const user : User = session?.user as User
    return (
        <div>
           {
            session?(
                <div>
                    <h2>{user?.username}</h2>
                    <button onClick={() => signOut()}>Logout</button>
                </div>
            ) : (
                <div>
                    <Link href="/sign-in">Sign In</Link>
                    <Link href="/sign-up">Sign Up</Link>
                </div>
            )
           }
        </div>
    )
}


