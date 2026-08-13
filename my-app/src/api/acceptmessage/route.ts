import { getServerSession } from "next-auth"; // search what's it's use case
import dbconnet from "@/src/lib/dbConnet";
import UserModel from "@/src/model/User";
import { User } from "next-auth";
import { authoptions } from "../auth/[...nextauth]/options";

export async function POST(request : Request){
    dbconnet()

    const session = await getServerSession(authoptions)
    const sessionuser : User = session?.user as User

    if(!session || !sessionuser){
        return Response.json(
            {
                success : false,
                message : "unauthorized"
            },
        {status : 401}
        )
    }

    const userId = sessionuser._id;
    const {acceptmessage} = await request.json()

    try{
    const userfind = await UserModel.findByIdAndUpdate(userId , {
        isAcceptingMessage : acceptmessage
    },{
        new : true
    })
    if(!userfind){
        return Response.json(
            {
                success : false,
                message : "user not found"
            },
        {status : 404}
        )
    }else{
        return Response.json(
            {
                success : true,
                message : "Message acceptance status updated successfully"
            },
        {status : 200}
        )
    }
    }catch(error){
        console.log("failed");
        return Response.json(
            {
                success : false,
                message : "failed to update message acceptance status"
            },
        {status : 500}
        )
    }

}

export async function GET(request : Request) {
    dbconnet()
    const session = await getServerSession(authoptions)
    const sessionuser : User = session?.user as User
    if(!session || !sessionuser){
        return Response.json(
            {
                success : false,
                message : "Unauthorized"
            },
        {status : 401}
        )
    }
    try {
     const user = await UserModel.findById(sessionuser._id)
     if(!user){
        return Response.json(
            {
                success : false,
                message : "user not found"
            },
        {status : 404}
        )
     }else{
        return Response.json(
            {
                success : true,
                message : "message status provided successfully",
                isAcceptingMessage : user.isAcceptingMessage
            },
        {status : 200}
        )

     }
    } catch (error) {
        console.error("Error in get message acceptance status route : ",error)
        return Response.json(
            {
                success : false,
                message : "failed to get message status"
            },
        {status : 500}
        )
    }
}

// these are the routes to get the info about whether user wants
// to accept the message or not






