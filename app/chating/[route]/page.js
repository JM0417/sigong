import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"
import { connectDB } from "@/util/database"
import BackBtn from "@/component/BackBtn"
import Link from "next/link"
import { ObjectId } from "mongodb"

export default async function Chating(props) {

    let session = await getServerSession(authOptions)

    const db = (await connectDB).db("capstone")
    let result = await db.collection('chating').find({bidding_id : props.params.route}).toArray()
    let bidding = await db.collection('bidding').findOne({_id : new ObjectId(props.params.route)})
   
    let today = new Date();   
    let now = `${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일 ${today.getHours}시 ${today.getMinutes}분`
    

    if(session){
        if(session.user.type == "business"){
            let estimate = await db.collection('estimate').findOne({_id : new ObjectId(bidding.estimate_id)})
            console.log(estimate)
            let customer = await db.collection('member').findOne({_id : new ObjectId(estimate.customer_id)})
            console.log(customer)

            return(
                <div className="chating">
                    <h4>채팅</h4>
                    <div className="chatingUserData">
                        <img src="/user.png"/>
                        <div className="chatingUserName">
                            <span>{customer.name}</span>
                        </div>
                        <div className="chatingUserDetail">
                            <Link href={'/'}>상세정보 </Link>
                        </div>
                    </div>
                    <div className="chatingArea">
                        {
                            result.map((a,i)=>
                                <div className={(result[i].user_type == "business") ? "customerChat" : "businessChat"}>
                                    <span>{result[i].message}</span>
                                </div>
                            )
                        }
                    </div>
                    <div className="chatingInput">
                        <form action="/api/chat" method="POST">
                            <input type="text" name="bidding_id" style={{display : "none"}} defaultValue={props.params.route}/>
                            <input type="text" name="user_id" style={{display : "none"}} defaultValue={session.user._id}/>
                            <input type="text" name="user_type" style={{display : "none"}} defaultValue={session.user.type}/>
                            <input type="text" name="time" style={{display : "none"}} defaultValue={now}/>
                            <textarea type="text" name="message" required/>
                            <button type="submit">전송</button>
                        </form>
                    </div>
                    <div className="chatingBtnBusiness">
                        <Link href={'/bidding'}>닫기</Link>
                    </div>
                </div>
            )
        }
        if(session.user.type == "customer"){
            let business = await db.collection('member').findOne({_id : new ObjectId(bidding.business_id)})

            return(
                <div className="chating">
                    <h4>채팅</h4>
                    <div className="chatingUserData">
                        <img src="/user.png"/>
                        <div className="chatingUserName">
                            <span>{business.name}</span>
                        </div>
                        <div className="chatingUserDetail">
                            <Link href={'/'}>상세정보 </Link>
                        </div>
                    </div>
                    <div className="chatingArea">
                        {
                            result.map((a,i)=>
                                <div className={(result[i].user_type == "customer") ? "customerChat" : "businessChat"}>
                                    <span>{result[i].message}</span>
                                </div>
                            )
                        }
                    </div>
                    <div className="chatingInput">
                        <form action="/api/chat" method="POST">
                            <input type="text" name="bidding_id" style={{display : "none"}} defaultValue={props.params.route}/>
                            <input type="text" name="user_id" style={{display : "none"}} defaultValue={session.user._id}/>
                            <input type="text" name="user_type" style={{display : "none"}} defaultValue={session.user.type}/>
                            <input type="text" name="time" style={{display : "none"}} defaultValue={now}/>
                            <textarea type="text" name="message" required/>
                            <button type="submit">전송</button>
                        </form>
                    </div>
                    <div className="chatingBtn">
                        <form action="/api/successfulBid" method="POST">
                            <input type="text" name="bidding_id" style={{display : "none"}} defaultValue={props.params.route}/>
                            <div>
                                <button className="successfulBid">낙찰하기</button>
                                <Link href={'/bidding'}>닫기</Link>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }
    }

    return Home()

}