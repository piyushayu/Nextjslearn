'use client'
import { useEffect, useState } from "react"
import { useSession , signIn , signOut } from "next-auth/react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import z from "zod"
import { useDebounceValue } from "usehooks-ts"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/router"
import signupschema from "@/src/Schemas/signupschema"
import axios, { AxiosError } from "axios"
import { Apiresponse } from "@/src/lib/Apiresponse"

const Signpage = () => {

    const [username , setUsername] = useState("")
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debouncedUsername = useDebounceValue(username, 300)
    const router = useRouter()
    

    //zod implement 
    const form = useForm<z.infer<typeof signupschema>>({
        resolver : zodResolver(signupschema),
        defaultValues : {
            username : "",
            email : "",
            password : ""
        }
    })

    useEffect(() => {
    const checkusernamenew = async () => {
        if(debouncedUsername){
            setSuccess('')
            try {
             const fetchdata = await axios.get(`/api/checkusername?username=${debouncedUsername}`) 
            if(fetchdata.data.success){
                setSuccess("Username is available")
            }else{
                setSuccess("Username is not available")
            }
            } catch (error) {
                const axioserror = error as AxiosError<Apiresponse>
                setSuccess(axioserror.response?.data.message || "Error checking username")

            }finally{
                setLoading(false)
            }
        }
    }

    checkusernamenew()
    } , [debouncedUsername])
   
    const onsubmit = async (data : z.infer<typeof signupschema>) => {
        setIsSubmitting(true)
        try{
            const response = await axios.post('/api/signup' , data)
            if(response.data.success){
                toast.add({
                    title : 'Success',
                    description : 'User signed up successfully'
                })
                router.replace(`/verify/${username}`)
            }
        }catch(error){
            const axioserror = error as AxiosError<Apiresponse>
            toast.add({
                title : 'Error',
                description : axioserror.response?.data.message || 'Error signing up'
            })
        }finally{
            setIsSubmitting(false)
        }
    }
 
    return (
        <div>sign-up page</div>
    )
}

export default Signpage