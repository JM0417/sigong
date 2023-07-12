import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb"

export default async function handler(req, res){

    if(req.method == "POST"){        

        const db = (await connectDB).db("capstone")
        let result = await db.collection('bidding').findOne({_id : new ObjectId(req.body.bidding_id)})
        let biddingUpdate = await db.collection('bidding').updateOne({_id : new ObjectId(req.body.bidding_id)}, { $set : { state : "리뷰쓰기"} })
        let estimateResult = await db.collection('estimate').updateOne({_id : new ObjectId(result.estimate_id)}, { $set : { result : "review"} })

        res.redirect(302, `/estimating`)
    }
    
}

