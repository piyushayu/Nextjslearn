import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import dbconnet from "@/src/lib/dbConnet";
import UserModel from "@/src/model/User";


export const authoptions : NextAuthOptions = {
    providers : [
       CredentialsProvider({
        id : "credentials",
        name : "credentials",
        credentials : {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" }
        },
        // we gave above credientials because nextjs automatically generate the ui part of the form 
        // of each credentials that we provide here 

        async authorize (credentials : any): Promise<any>{
           await dbconnet()
           try{
            const user = await UserModel.findOne({
                $or : [
                    {email : credentials.identifier.email} , 
                    {username : credentials.identifier.username}
                ]
            })

            if(!user){
                throw new Error("user not found")
            }

            if(!user.isVerified){
                throw new Error("user not verified")
            }

            const isPasswordValid = await bcrypt.compare(credentials.password , user.Password)

            if(isPasswordValid){
                return user
            }else {
            throw new Error("user not verified")
            }
           }catch(err : any){
            throw new Error(err)
           }
        }

       })
    ] ,

    pages : {
        signIn : "/sign-in"
    },
    // for signup we usually make our own custom form to get the info 
    // this is not just a route decleration , it automatically make the page for this route

    session : {
        strategy : "jwt"
    },

    secret : process.env.NEXTAUTH_SECRET,

    callbacks : {
        async jwt({token , user}){
            if(user){
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
        },
     // we are adding so much info in this because jwt token is used in the 
     // server component to identify the user
     // the session is sent to the client component as a prop
        async session ({session , token}){
        if(token){
            session.user._id = token._id 
            session.user.username = token.username
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
        }
            return session
        }
    }
}

