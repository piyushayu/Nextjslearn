import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    _id?: string;
    isAcceptingMessages?: boolean;
    isVerified?: boolean;
    username?: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}

// other method of customizing the value 
declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    isAcceptingMessages?: boolean;
    isVerified?: boolean;
    username?: string;
  }
}
