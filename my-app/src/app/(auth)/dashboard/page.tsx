"use client"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from "axios"
import { Apiresponse } from "@/src/lib/Apiresponse"
import { toast } from "@/components/ui/toast"
import { zodResolver } from "@hookform/resolvers/zod"
import acceptschema from "@/src/Schemas/acceptschema"
import z from "zod"
import { User } from "next-auth"
const page = () => {

    const { data: session } = useSession()

    const form = useForm<z.infer<typeof acceptschema> >({
        resolver : zodResolver(acceptschema),
        defaultValues : {
            isAcceptingMessage : true
        }
    })

 const {register , watch , setValue } = form
 const [message , setMessages] = useState([])
const [isloading , setLoding] = useState(false)

 const acceptMessages = watch('isAcceptingMessage')
 // this helps to see the current value of the state inside the schema 

 const fetchacceptmessage = useCallback(async()=>{
     try {
        setLoding(true)
        const response = await axios.get('api/accept-messages')
        setValue('isAcceptingMessage' , response.data.isAcceptingMessage) // change the value in that field
     } catch (error) {
        const axiosError = error as AxiosError<Apiresponse>
        toast.add({
            title : "error",
            description : axiosError.response?.data.message
        })
     }finally{
        setLoding(false)
     }
 }, [setValue])

 const fetchMessages = useCallback(async() => {
  setLoding(true)
  try{
        const response = await axios.get('/api/get-messages')
        setMessages(response.data.messages) 
  }catch(error){
     const axiosError = error as AxiosError<Apiresponse>
        toast.add({
            title : "error",
            description : axiosError.response?.data.message
        })
  }finally{
    setLoding(false)
  }
 },[setMessages])
// we can also add refresh option also in fetch data

useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchacceptmessage()
}, [session, setValue, fetchacceptmessage, fetchMessages])

const handleswitchchange = async () => {
    try {
        setLoding(true)
        const response = await axios.post('/api/get-messages' , {acceptMessages : !acceptMessages})
       setValue('isAcceptingMessage' , !acceptMessages)
    } catch (error) {
        const axiosError = error as AxiosError<Apiresponse>
        toast.add({
            title : "error",
            description : axiosError.response?.data.message
        })
    }finally{
        setLoding(false)
    }
}

const {username} = session?.user as User

// search for more method of baseurl formation and giving 
const baseUrl = `${window.location.protocol}//${window.location.host}`

const profileurl = `${baseUrl}/u/${username}`

const copy = () => {
    navigator.clipboard.writeText(profileurl)
    toast.add({
        title : "success",
        description : "Profile URL copied"
    })
}

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default page