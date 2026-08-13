import dbconnet from "@/src/lib/dbConnet";
import UserModel from "@/src/model/User";
import z from "zod";
import verifyschema from "@/src/Schemas/verifyschema";

async function GET(request : Request) {
    await dbconnet();

    try{
    // const {searchParams} = new URL(request.url)

    // // sometime we might face problem in getting data from url so 
    // // we use decodeuricomponent

    // const codeparams = {
    //     code : searchParams.get('code')
    // }
    // // validating the code
    // const result = verifyschema.safeParse(codeparams)

    // we can use json format to get the data 

    const { username , code } = await request.json()

    const decodedcode = decodeURIComponent(code)
    const decodedusername = decodeURIComponent(username)

    const user = await UserModel.findOne({username : decodedusername})

    if(!user){
        return Response.json({
            success : false,
            message : "User not found"
        },
    {status : 404})
    }

    if(user.isVerified){
        return Response.json({
            success : false,
            message : "User is already verified"
        },
    {status : 400})
    }

    const iscodeexpired = user.verifyCodeExpiry ? new Date(user.verifyCodeExpiry) > new Date() : false;
    const iscodevalid = user.verifyCode === decodedcode

    if(iscodeexpired && iscodevalid){
        user.isVerified = true;
        user.verifyCode = undefined
        user.verifyCodeExpiry = undefined
        await user.save();
        return Response.json({
            success : true,
            message : "User verified successfully"
        },
    {status : 200})
    } else if (!iscodevalid){
       return Response.json({
            success : false,
            message : "Incorrect Verification Code"
        },
    {status : 400})
    } else {
        return Response.json({
            success : false,
            message : "code expiry"
        },
    {status : 400})
    }

    }
    catch(error){
        console.error("Error in check code route : ",error)
        return Response.json({
            success : false,
            message : "Error checking code"
        },
    {status : 500})
    }

}













