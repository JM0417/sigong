import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"
import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb"
import Link from "next/link"
import Home from "@/app/page"

    
// 네비게이션 채팅 첫 페이지

export default async function Bidding(props) {

    let session = await getServerSession(authOptions)

    const db = (await connectDB).db("capstone")

   
    

    if(session){
        if(session.user.type == "business"){

            let result = await db.collection('estimate').find().toArray()
            let bidding = await db.collection('bidding').find({business_id : props.params.route, state : "상담 중"}).toArray()

            let businessObject =[]
            let estimate_id
        
            for(let i = 0; i<bidding.length; i++){
                estimate_id = bidding[i].estimate_id
                businessObject[i] = await db.collection('estimate').findOne({_id : new ObjectId(estimate_id)})
            }
        
            return(
                <div className="estimates">
                    <h4>채팅</h4>
                    {
                        businessObject.map((a,i)=>
                            <div className="estimate-list" key ={i} style={(bidding[i].state == "상담 중")?{backgroundColor: "#71A894"}:{backgroundColor:"white"}}>
                                <Link href={`/chating/${bidding[i]._id}`}>
                                    <span className="estimateDetailLocation">{businessObject[i].location}</span>
                                    <span className="estimateDetailSize">{businessObject[i].size}</span>
                                    <span className="estimateDetailPurpose">{businessObject[i].purpose}</span>
                                    <span className="estimateDetailBudget">{businessObject[i].budget}</span>
                                    <p>{businessObject[i].date}</p>
                                    <span>{bidding[i].state}</span>
                                </Link>
                            </div>
                        )
                    }
                    <Link href={"/"} className="linkMainPage">돌아가기</Link>
                </div>
            )
        }
        if(session.user.type == "customer"){

            let result = await db.collection('estimate').findOne({customer_id : session.user._id})

            if(result){
                let biddingList = await db.collection('bidding').find({estimate_id : result._id.toString(), state : "상담 중"}).toArray()
                return (
                    <div>
                        <div className="biddingState">
                            <h4>채팅</h4>
                            <div> 
                                <div>
                                    {
                                        biddingList.map((a,i)=>
                                            <div className="biddingList" key ={i} style={(biddingList[i].state == "상담 중")?{backgroundColor: "#71A894"}:{backgroundColor:"white"}}>
                                                <Link href={`/chating/${biddingList[i]._id}`}>
                                                    <span className="biddingListPrice">{biddingList[i].price}</span>
                                                    <span className="biddingListState">{biddingList[i].state}</span>
                                                    <span className="biddingListName"><img src="/user.png"/> {biddingList[i].business_name}</span>
                                                    <span className="biddingListRight">{">"}</span>
                                                </Link>
                                            </div>
                                        )
                                    }
                                </div>
                                <Link href={'/'} className="linkMainPage">돌아가기</Link>
                            </div>
                        </div>
                    </div>
                )
            }else{
                return (
                    <div>
                        <div className="biddingState">
                            <h4>채팅</h4>
                            <Link href={'/'} className="linkMainPage">돌아가기</Link>
                        </div>
                    </div>
                )
            }
        }
    }
    return Home()

}