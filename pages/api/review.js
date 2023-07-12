import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb"

export default async function handler(req, res){

    if(req.method == "POST"){        

        const db = (await connectDB).db("capstone")
        let review = await db.collection('review').insertOne(req.body)
        let endestimate = await db.collection('endestimate').insertOne(db.collection('estimate').findOne({_id : new ObjectId(req.body.estimate_id)}))

        let result = await db.collection('bidding').findOne({_id : new ObjectId(req.body.bidding_id)})
        let estimateResult = await db.collection('estimate').deleteOne({_id : new ObjectId(req.body.estimate_id)})

        let biddingUpdate = await db.collection('bidding').deleteMany({_id : new ObjectId(req.body.bidding_id)})

        res.redirect(302, `/`)
    }
    
}

