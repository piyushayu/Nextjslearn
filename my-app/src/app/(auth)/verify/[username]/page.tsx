"use client"
import { useParams, useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'
import verifyschema from '@/src/Schemas/verifyschema'
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {z} from "zod"
import axios from 'axios'
import { Form } from '@base-ui/react'


function verifycode() {
    const params = useParams<{username : string}>()
    const router = useRouter()

    const form = useForm<z.infer<typeof verifyschema>>({ 
        resolver : zodResolver(verifyschema),
        defaultValues : {
            code : ""
        }
     })

     const onSubmit = async (data : z.infer<typeof verifyschema>) => {
        try {

           const response  =  await axios.post(`/api/verify-code`, {
                username : params.username,
                code : data.code
            })

            toast.add({
                title : "success",
                description : response.data.message
            })

            router.replace('/sign-in')
            
        } catch (error) {
            console.log("Error in verifycode"), error
        }
     }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
       {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
             control={form.control}
             name="code"
             render={({ field }) => (
                <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your verification code" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
             )}

            />
        </form>
       </Form> */} 
       {/* same code for form making  */}
    </div>
  )
}
export default verifycode

// to make the dynamic route we make a folder inside the main with [] brackets 
