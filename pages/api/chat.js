import { connectDB } from "@/util/database"

export default async function handler(req, res){

    if(req.method == "POST"){        

        const db = (await connectDB).db("capstone")
        let result = await db.collection('chating').insertOne(req.body)
        
        res.redirect(302, `/chating/${req.body.bidding_id}`)
    }
    
}

