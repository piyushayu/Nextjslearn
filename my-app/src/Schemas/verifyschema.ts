import { z } from "zod";

const verifyschema = z.object({
    code: z.string().length(6, "Verification code must be 6 digits long"),
})

export default verifyschema;

