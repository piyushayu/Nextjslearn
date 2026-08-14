import dbconnet from "@/src/lib/dbConnet";
import UserModel from "@/src/model/User";
import bcrypt from "bcrypt"

export async function POST(request:Request) {
    await dbconnet()

    try{
        // second thing which is different
        const {username , email , password} = await request.json()

    const existverifyuser = await UserModel.findOne({
        username : username,
        isVerified : true 
    })

    if(existverifyuser){
        return Response.json({
            success : false,
            message : "username exist"
        },{status : 400})
    }

    const existverifyuserbyemail = await UserModel.findOne({
        email : email
    })
    const code = Math.floor(Math.random() * 90000 + 10000 ).toString()

    if(existverifyuserbyemail){
       if(existverifyuserbyemail.isVerified){
        return Response.json({
            success : false ,
            message : "email exist"
        }, {status : 400})
       }else{
       const hashpassword = await bcrypt.hash(password , 10)
       existverifyuserbyemail.Password = hashpassword ;
       existverifyuserbyemail.verifyCode = code ;
       existverifyuserbyemail.verifyCodeExpiry = new Date(Date.now() + 3600000)

       await existverifyuserbyemail.save()
       }
    }else{
       const hashpassword = await bcrypt.hash(password , 10)

       const expirydata = new Date()
       expirydata.setHours(expirydata.getHours() + 1) // 1hr code will expire
    
    const newuser = new UserModel({
        username,
        email,
        password : hashpassword,
        verifyCode : code,
        verifyCodeExpiry : expirydata,
        isVerified : false ,
        isAcceptingMessage : true,
        messages : []
    })

    await newuser.save()
    }

    // email verfification here

    }catch(error){
        console.log("error" , error);
        return Response.json({
            success : false,
            message : "error"
        },{
            status : 500
        })
    }
}
