import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb"

export default async function handler(req, res){

    if(req.method == "POST"){        

        const db = (await connectDB).db("capstone")
        let result = await db.collection('bidding').updateOne({_id : new ObjectId(req.body._id)}, { $set : { state : "상담 중"} })

        res.redirect(302, `/estimating`)                
    }
    
}

