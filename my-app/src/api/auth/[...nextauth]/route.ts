import NextAuth from "next-auth";

import { authoptions } from "./options";

const handler = NextAuth(authoptions)
// nextauth is a method which return a handler function 
// and it want options as input field

export {handler as GET , handler as POST} 


