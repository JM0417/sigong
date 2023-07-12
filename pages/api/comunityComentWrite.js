import { connectDB } from "@/util/database"

export default async function handler(req, res){

    if(req.method == "POST"){        

        const db = (await connectDB).db("capstone")
        let result = await db.collection('coment').insertOne(req.body)
        
        return res.redirect(302, `/comunityDetail/${req.body.content_id}`)
    }
    
}

