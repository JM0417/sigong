import { connectDB } from "@/util/database"

export default async function handler(req, res){

    if(req.method == "POST"){        

        const db = (await connectDB).db("capstone")
        let result = await db.collection('comunity').insertOne(req.body)
        
        return res.redirect(302, '/comunity/1')   
    }
    
}

