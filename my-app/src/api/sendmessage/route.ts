import dbconnet from "@/src/lib/dbConnet";
import UserModel from "@/src/model/User";
import { Message } from "@/src/model/User";

export async function POST(request : Request){
    await dbconnet()

    const {username , content} = await request.json()

    try{
    const finduser = await UserModel.findOne({
        username : username ,
        isVerified : true
    })

    if(!finduser){
        return Response.json(
            {
                success : false,
                message : "user not found"
            },
        {status : 404}
        )
    }

    if(finduser.isAcceptingMessage === false){
        return Response.json(
            {
                success : false,
                message : "user is not accepting messages"
            },
        {status : 403}
        )
    }

    const message = {
        content,
        createdAt: new Date()
    }

    finduser.messages.push(message as unknown as Message) // check what's the need of this unknown 
    await finduser.save()

    return Response.json({
        success : true ,
        message : "message sent successfully"
    },
    {status : 200})
    
    }catch(error){
        console.log("error occurred", error)
        return Response.json(
            {
                success : false,
                message : "internal server error"
            },
        {status : 500}
        )
    }

}



