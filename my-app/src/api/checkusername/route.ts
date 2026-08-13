import dbconnet from "@/src/lib/dbConnet";
import UserModel from "@/src/model/User";
import z from "zod";
import {usernameschema} from "@/src/Schemas/signupschema"

const Usernamequeryschema = z.object({
    username : usernameschema
})

export async function GET(request: Request) {
    
    await dbconnet()

    try{
        const {searchParams} = new URL(request.url) // to get all the search params
        const queryParam = {
            username : searchParams.get('username') // this means we only want the username params from all the params
        }

        // Validate the username using zod
        const result = Usernamequeryschema.safeParse(queryParam)
        // this result contains a lot of thing inside it like for ex
        // success error data
        if(!result.success){
            const usernameerror = result.error.format().username?._errors || []
            return Response.json({
                success : false,
                message : usernameerror.join(',') 
            },
        {status : 400})
        }

        const {username} = result.data

        const existuser = await UserModel.findOne({
         username : username , isVerified : true
        })

        if(existuser){
            return Response.json({
                success : false,
                message : "Username already exists"
            })
        }

        if (!existuser){
            return Response.json({
                success : true,
                message : "Username is available"
            })
        }

    }catch(error){
        console.error("Error in check username route : ",error)
        return Response.json({
            success : false,
            message : "Error checking username"
        },
    {status : 500})
    }

}





