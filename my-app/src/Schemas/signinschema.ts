import {z} from "zod"

const signInschema = z.object({
    identifier : z.string(),
    password : z.string(),
})

export default signInschema;