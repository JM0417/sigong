import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"
import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb"
import Link from "next/link";
import Home from "@/app/page"


// 고객 견적내기 첫 페이지 
// 견적을 낸 경우 입찰 현황 / 낙찰한 경우 낙찰 후 페이지(상담 후 시공완료하고 리뷰까지)

export default async function Estimating() {

    let session = await getServerSession(authOptions)

    if(session){
        const db = (await connectDB).db("capstone")
        let result = await db.collection('estimate').findOne({customer_id : session.user._id})

            if(session.user.type == "customer"){

                // 시공상태가 "낙찰"일 때 채팅을 이어가며 시공완료 버튼을 누르면 
                if(result){
                    let biddingList = await db.collection('bidding').find({estimate_id : result._id.toString()}).toArray()

                    let today = new Date();   
                    let now = `${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`

                    if(result.result == "done"){
                        let bidding = await db.collection('bidding').findOne({estimate_id : result._id.toString(), state : "낙찰"})
                        let business = await db.collection('member').findOne({_id : new ObjectId(bidding.business_id)})

                        let chat = await db.collection('chating').find({bidding_id : bidding._id.toString()}).toArray()
            
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
                                        chat.map((a,i)=>
                                            <div className={(chat[i].user_type == "customer") ? "customerChat" : "businessChat"}>
                                                <span>{chat[i].message}</span>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="chatingInput">
                                    <form action="/api/chat" method="POST">
                                        <input type="text" name="bidding_id" style={{display : "none"}} defaultValue={bidding._id.toString()}/>
                                        <input type="text" name="user_id" style={{display : "none"}} defaultValue={session.user._id}/>
                                        <input type="text" name="user_type" style={{display : "none"}} defaultValue={session.user.type}/>
                                        <input type="text" name="time" style={{display : "none"}} defaultValue={now}/>
                                        <textarea type="text" name="message" required/>
                                        <button type="submit">전송</button>
                                    </form>
                                </div>
                                <div className="chatingBtn">
                                    <form action="/api/constructionCompleted" method="POST">
                                        <input type="text" name="bidding_id" style={{display : "none"}} defaultValue={bidding._id.toString()}/>
                                        <div>
                                            <button className="constructionCompleted">시공완료</button>
                                            <Link href={'/'}>닫기</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )
                    }else if(result.result == "review"){
                        let bidding = await db.collection('bidding').findOne({estimate_id : result._id.toString(), state : "리뷰쓰기"})

                        return(
                            <div className="customerReview">
                                <h4>리뷰쓰기</h4>
                                <div className="customerReviewImg">
                                    <img src="/checked.png"/>
                                </div>
                                <div className="customerReviewSpan">
                                    <span>시공을 성공적으로 마무리 하였습니다.</span>
                                    <span>리뷰를 작성하시고 새로운 상담을 요청해보세요</span>
                                </div>
                                <div className="customerReviewForm">
                                    <form action="/api/review" method="POST">
                                        <input style = {{display : 'none'}} name = "customer_id" defaultValue={session.user._id}/>
                                        <input style = {{display : 'none'}} name = "bidding_id" defaultValue={bidding._id.toString()}/>
                                        <input style = {{display : 'none'}} name = "estimate_id" defaultValue={result._id.toString()}/>
                                        <input style = {{display : 'none'}} name = "time" defaultValue={now}/>
                                        <span>내용</span>
                                        <textarea type="text" name="content"/>
                                        <button>작성완료</button>
                                    </form>
                                </div>
                            </div>
                        )
                        
                    }else{

                        biddingList.reverse()

                        return(
                            <div>
                                <div className="biddingState">
                                    <h4>입찰 현황</h4>
                                    {/* 수정하기 버튼 및 내 입찰 현황 */}
                                    <div> 
                                        <div>
                                            <span className="biddingCount">지금까지 시공자 {biddingList.length}명이 입찰했습니다.</span>
                                            {
                                                biddingList.map((a,i)=>
                                                    <div className="biddingList" key ={i} style={(biddingList[i].state == "상담 중")?{backgroundColor: "#71A894"}:{backgroundColor:"white"}}>
                                                        <Link href={(biddingList[i].state == "상담 중" ? `/chating/${biddingList[i]._id}` : `/biddingDetail/${biddingList[i]._id}`)}>
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
                                    {/* 수정하기 중단하기 버튼 만들기 */}
                                    {/* result.map(a,i) 써서 숨고처럼 입찰한 정보들 게시판처럼 보여주기 */}
                                </div>
                            </div>
                        )
                    }
                }else{
                    let today = new Date();   
                    let now = `${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`
                    
                    return (
                        <div>
                            <div className="estimatingBox">
                                <h4>견적내기</h4>
                                <form action="/api/estimating" method="POST">
                                    <input style = {{display : 'none'}}name = "customer_id" defaultValue={session.user._id}/>
                                    <input style = {{display : 'none'}}name = "result" defaultValue="none"/>
                                    <input style = {{display : 'none'}}name = "date" defaultValue={now}/>
                                    <div className="estimatingBoxLeft">
                                        <span>물건번호</span>
                                        <input name="buildingNumber" type="text" placeholder="2023 타경 1234" required/>
                                        <span>위치</span>
                                        <select name="location" type="text">
                                            <option value="서울특별시">서울특별시</option>
                                            <option value="인천광역시">인천광역시</option>
                                        <option value="경기도">경기도</option>
                                        </select>
                                        <span>목적</span>
                                        <select name="purpose" type="text">
                                            <option value="매도">매도</option>
                                            <option value="임대">임대</option>
                                            <option value="실거주">실거주</option>
                                        </select>
                                        <span>유형</span>
                                        <select name="ResidentialType" type="text">
                                            <option value="아파트">아파트</option>
                                            <option value="오피스텔">오피스텔</option>
                                            <option value="주택">주택</option>
                                            <option value="상가">상가</option>  
                                        </select>
                                        <span>평수</span>
                                        <input name="size" type="numeber" placeholder="00 평" required/>
                                        <span>예산</span>
                                        <input name="budget" type="text" placeholder="000 만원" required/>
                                    </div>
                                    <div className="estimatingBoxRight">
                                        <span>성함</span>
                                        <input name="name" type="text" placeholder="홍길동" required/>
                                        <span>전화번호</span>
                                        <input name="phoneNumber" type="text" placeholder="010-1234-5678" required/>
                                        <span>내용</span>
                                        <textarea name="content" type="text" placeholder="내용" required/>
                                    </div>
                                    <div className="estimatingBoxBtn">
                                        <button>3D인테리어</button>
                                        <button type="submit">제출하기</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }
            }
        }
        Home()
    }