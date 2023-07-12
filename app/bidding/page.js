import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"
import { connectDB } from "@/util/database"
import Link from "next/link"
import Home from "@/app/page"

// 사업자 입찰하기 첫 페이지
    
export default async function Bidding() {

    let session = await getServerSession(authOptions)

    const db = (await connectDB).db("capstone")
    let result = await db.collection('estimate').find().toArray()

    if(session){

        for(let i = 0; i <result.length; i++){
            let bidding = await db.collection('bidding').findOne({business_id : session.user._id, estimate_id : result[i]._id.toString()})
            if(bidding){
                result[i].state = bidding.state;
                result[i].bidding_id = bidding._id.toString()
            }else{
                result[i].state = '미입찰'
            }
        }
        console.log(result)

        if(session.user.type == "business"){

            result.reverse()
            
            return(
            <div className="estimates">
                <h4>입찰요청</h4>
                {
                    result.map((a,i)=>
                        <div className="estimate-list" key ={i} style={(result[i].state == "상담 중")?{backgroundColor: "#71A894"}:{backgroundColor:"white"}}>
                            <Link href={(result[i].state == "상담 중") ? `/chating/${result[i].bidding_id}` : `/estimateDetail/${result[i].customer_id}`}>
                                <span className="estimateDetailLocation">{result[i].location}</span>
                                <span className="estimateDetailSize">{result[i].size}</span>
                                <span className="estimateDetailPurpose">{result[i].purpose}</span>
                                <span className="estimateDetailBudget">{result[i].budget}</span>
                                <p>{result[i].date}</p>
                                <span>{result[i].state}</span>
                            </Link>
                        </div>
                    )
                }
                <Link href={"/"} className="linkMainPage">돌아가기</Link>
            </div>
            )
        }
    }

    return Home()

}