import { connectDB } from "@/util/database"

export default async function handler(req, res){

    if(req.method == "POST"){        

        const db = (await connectDB).db("capstone")
        let result = await db.collection('bidding').insertOne(req.body)
        
        res.redirect(302, '/bidding')
        
    }
    
}

