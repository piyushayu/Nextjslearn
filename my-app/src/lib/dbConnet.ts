import mongoose from "mongoose"

type connectionstring = {
    isConnected?: number;
}

const connection : connectionstring = {}


async function dbconnet() : Promise<void> {
    if(connection.isConnected){
        console.log("Already connected");
        return;
    }
    try {
       const db =  await mongoose.connect(process.env.MONGODB_URI || "")
        connection.isConnected = db.connections[0].readyState;
        console.log(db.connection)
        console.log(" Database connected successfully ")
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
    
}

export default dbconnet