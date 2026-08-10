import {z} from "zod";

const acceptschema = z.object({
    isAcceptingMessage : z.boolean(),
})

export default acceptschema;
