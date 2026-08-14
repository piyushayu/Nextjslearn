import { getServerSession } from "next-auth"; // search what's it's use case
import dbconnet from "@/src/lib/dbConnet";
import UserModel from "@/src/model/User";
import { User } from "next-auth";
import { authoptions } from "../auth/[...nextauth]/options";

export async function GET(request : Request) {
    dbconnet()
    const session = await getServerSession(authoptions)
    const sessionuser = session?.user 
    if(!session || !sessionuser){
        return Response.json(
            {
                success : false,
                message : "Unauthorized"
            },
        {status : 401}
        )
    }

    const userId = sessionuser._id

    try{
     const finduser = await UserModel.aggregate([
        {$match : {_id : userId}},
        {$unwind : '$messages'}, // to deconstruct the array of messages into individual docs
        {$sort : {'messages.createdAt' : -1}}, // to sort the messages in descending order of their creation time
        {$group : {_id : '$_id' , messages : {$push : '$messages'}}} 
    ])

    if(!finduser || finduser.length === 0){
        return Response.json(
            {
                success : false,
                message : "user not found"
            },
        {status : 404}
        )
    }

    return Response.json({
        success : true ,
        messages : finduser[0].messages
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