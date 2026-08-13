import {email, z} from "zod";

export const usernameschema = z.string()
.min(3,"Username must be at least 3 characters")
.max(20,"Username must be at most 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"Username can only contain letters, numbers and underscores")

const signupschema = z.object({
    username : usernameschema,
    email : z.string().email({message:"Invalid email"}),
    password : z.string().min(6,{message:"Password must be at least 6 characters"})
})

export default signupschema;
