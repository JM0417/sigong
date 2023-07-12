import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"
import { connectDB } from "@/util/database"
import Link from "next/link"
import { ObjectId } from "mongodb"
import Home from "@/app/page"
import BackBtn from "@/component/BackBtn";

// 사업자가 견적을 내고 자기가 낸 견적을 확인하고 상담하는 페이지

export default async function Bidding(props) {

    let session = await getServerSession(authOptions)

    const db = (await connectDB).db("capstone")
    let result = await db.collection('estimate').findOne({ customer_id : props.params.route.toString()})
    let member = await db.collection('member').findOne({ _id : new ObjectId(props.params.route)})



    if(session){
        let biddingState = await db.collection('bidding').findOne({ estimate_id : result._id.toString(), business_id : session.user._id})

        if(session.user.type == "business"){
            if(biddingState){
                if(biddingState.state == "낙찰"){
                    let estimate = await db.collection('estimate').findOne({_id : new ObjectId(biddingState.estimate_id)})
                    let customer = await db.collection('member').findOne({_id : new ObjectId(estimate.customer_id)})
   
                    let today = new Date();   
                    let now = `${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`
                    
                    let chat = await db.collection('chating').find({bidding_id : biddingState._id.toString()}).toArray()
        
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
                                    chat.map((a,i)=>
                                        <div className={(chat[i].user_type == "business") ? "customerChat" : "businessChat"}>
                                            <span>{chat[i].message}</span>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="chatingInput">
                                <form action="/api/chat" method="POST">
                                    <input type="text" name="bidding_id" style={{display : "none"}} defaultValue={biddingState._id}/>
                                    <input type="text" name="user_id" style={{display : "none"}} defaultValue={session.user._id}/>
                                    <input type="text" name="user_type" style={{display : "none"}} defaultValue={session.user.type}/>
                                    <input type="text" name="time" style={{display : "none"}} defaultValue={now}/>
                                    <textarea type="text" name="message" required/>
                                    <button type="submit">전송</button>
                                </form>
                            </div>
                            <div className="chatingBtn">
                                <Link href={'/bidding'}>닫기</Link>
                            </div>
                        </div>
                    )
                    }else if(biddingState.state == "리뷰쓰기"){

                        let estimate = await db.collection('estimate').findOne({_id : new ObjectId(biddingState.estimate_id)})
                        let customer = await db.collection('member').findOne({_id : new ObjectId(estimate.customer_id)})

                        return(
                            <div className="customerReview">
                                <h4>시공완료</h4>
                                <div className="customerReviewImg">
                                    <img src="/checked.png"/>
                                </div>
                                <div className="customerReviewSpan">
                                    <span>시공을 성공적으로 마무리 하였습니다.</span>
                                    <span>{customer.name}님이 리뷰를 작성 중입니다.</span>
                                </div>
                            </div>
                        )
                    }else if(biddingState.state == "입찰완료"){
                    return(
                        <div className="bidding">
                            <div className="estimateDetail">
                                <div className="estimatingBox">
                                    <h4>상세내용</h4>
                                    <div className="estimateImage">
                                        <img src="/3dimage01.png"/>
                                    </div>
                                    <form>
                                        <div className="estimatingBoxLeft">
                                            <span>물건번호</span>
                                            <div>{result.buildingNumber}</div>
                                            <span>위치</span>
                                            <div>{result.location}</div>
                                            <span>목적</span>
                                            <div>{result.purpose}</div>
                                            <span>유형</span>
                                            <div>{result.ResidentialType}</div>
                                            <span>평수</span>
                                            <div>{result.size}</div>
                                            <span>예산</span>
                                            <div>{result.budget}</div>
                                        </div>
                                        <div className="estimatingBoxRight">
                                            <span>성함</span>
                                            <div>{result.name}</div>
                                            <span>전화번호</span>
                                            <div>{result.phoneNumber}</div>
                                            <span>내용</span>
                                            <div className="estimatingBoxRightContent">{result.content}</div>
                                        </div>
                                    </form>
                                </div>
                                <div className="MyEstimate">
                                    <h4>내 견적</h4>
                                    <div className="MyEstimateContent">
                                        <span>가격</span>
                                        <p>{biddingState.price}</p>
                                        <span>내용</span>
                                        <p style={{height : "200px"}}>{biddingState.content}</p>
                                    </div>
                                    <div>
                                        <Link href={"/bidding"} className="linkMainPage">닫기</Link> 
                                    </div>
                                </div>             
                            </div>
                        </div>
                    )
                }
                }else{
                    return(
                        <div className="bidding">
                            <div className="estimateDetail">
                                <div className="estimatingBox">
                                    <h4>상세내용</h4>
                                    <div className="estimateImage">
                                        <img src="/3dimage01.png"/>
                                    </div>
                                    <form>
                                        <div className="estimatingBoxLeft">
                                            <span>물건번호</span>
                                            <div>{result.buildingNumber}</div>
                                            <span>위치</span>
                                            <div>{result.location}</div>
                                            <span>목적</span>
                                            <div>{result.purpose}</div>
                                            <span>유형</span>
                                            <div>{result.ResidentialType}</div>
                                            <span>평수</span>
                                            <div>{result.size}</div>
                                            <span>예산</span>
                                            <div>{result.budget}</div>
                                        </div>
                                        <div className="estimatingBoxRight">
                                            <span>성함</span>
                                            <div>{result.name}</div>
                                            <span>전화번호</span>
                                            <div>{result.phoneNumber}</div>
                                            <span>내용</span>
                                            <div>{result.content}</div>
                                        </div>
                                    </form>
                                </div>
                                <form action="/api/bidding" method="POST" className="biddingPop">
                                    <h4>견적내기</h4>
                                    <div className="biddingPopContent">
                                        <input style = {{display : 'none'}}name = "estimate_id" defaultValue={result._id.toString()}/>
                                        <input style = {{display : 'none'}}name = "business_id" defaultValue={session.user._id}/>
                                        <input style = {{display : 'none'}}name = "business_name" defaultValue={session.user.name}/>
                                        <input style = {{display : 'none'}}name = "state" defaultValue="입찰완료"/>
                                        <span>가격</span>
                                        <input name="price" placeholder="000만원" required/>
                                        <span>내용</span>
                                        <textarea name="content" placeholder="내용" required/>
                                        <div className="biddingPopBtn">
                                            <button type="submit">입찰하기</button>
                                            <Link href={"/bidding"}>닫기</Link>
                                        </div>
                                    </div>
                                </form>               
                                </div>
                        </div>
                    )  
                } 
        }else{
            return Home()
        }
    }else{
        return Home()
    }
}