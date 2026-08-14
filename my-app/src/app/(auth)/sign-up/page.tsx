'use client'
import { useEffect, useState } from "react"
import { useSession , signIn , signOut } from "next-auth/react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm , Controller} from "react-hook-form"
import z from "zod"
import { useDebounceCallback, useDebounceValue } from "usehooks-ts"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import signupschema from "@/src/Schemas/signupschema"
import axios, { AxiosError } from "axios"
import { Apiresponse } from "@/src/lib/Apiresponse"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const Signpage = () => {

    const [username , setUsername] = useState("")
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // const [debouncedUsername] = useDebounceValue(username, 300) 
     const debounced = useDebounceCallback(setUsername, 300) 

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
        if(username){
            setSuccess('')
            try {
             const fetchdata = await axios.get(`/api/checkusername?username=${username}`) 
             let message = fetchdata.data.success
             if(message){
                setSuccess(message)
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
    } , [username])
   
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
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signup-form" onSubmit={form.handleSubmit(onsubmit)}>
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-username">
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-username"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter username"
                      autoComplete="username"
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    {
                       success && (
                        <p className={`text-sm ${success ? "text-green-500" : "text-red-500"}`}>{success}</p>
                      )
                    }
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-email">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter email"
                      autoComplete="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-password">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter password"
                      autoComplete="new-password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="signup-form" disabled={isSubmitting}>
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    )
}

export default Signpage