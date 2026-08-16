'use client'
import signInschema from "@/src/Schemas/signinschema"
import { signIn, useSession } from "next-auth/react"
import z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/toast"
export default function Signinpage() {
    const router = useRouter()

    const onsubmit = async(data : z.infer<typeof signInschema>)=>{
        const response = await signIn("credentials" , {
            identifier : data.identifier,
            password : data.password,
            redirect : false,
        })

        if(response?.url){
            router.replace("/dashboard")
        }

        if(response?.error === 'CredentialsSignin'){
           toast.add({
            title : 'Error',
            description : "Invalid Credentials"
           })
        }
    }

    // from here other work is same as we did in other page 

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
