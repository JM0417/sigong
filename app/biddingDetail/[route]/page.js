import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth";
import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb";
import Home from "@/app/page"
import Link from "next/link"
import BackBtn from "@/component/BackBtn";

// 고객 견적내기 > 상세내용 or 채팅 페이지

export default async function Estimating(props) {

    let session = await getServerSession(authOptions)

    

    if(session){
        const db = (await connectDB).db("capstone")
        let result = await db.collection('estimate').findOne({customer_id : session.user._id})
        let biddingContent = await db.collection('bidding').findOne({_id : new ObjectId(props.params.route)})

        if(session.user.type == "customer"){
            if(result){
                return(
                    <div className="biddingDetail">
                        <h4>상세 내용</h4>
                        <div>
                            <div className="biddingDetailContent">
                                <div>
                                    <p>가격</p>
                                    <span>{biddingContent.price}</span>
                                </div>
                                <div>
                                    <p>내용</p>
                                    <span>{biddingContent.content}</span>
                                </div>
                            </div>
                            <div className="biddingDetailName">
                                <img src="/user.png"/>
                                <h4>{biddingContent.business_name}</h4>
                                <div>
                                    <span>리뷰수 49개</span>
                                    <span>별점 4.8점</span>
                                </div>
                                <span className="rightBtn">{">"}</span>
                            </div>
                            <div className="biddingDetailHistory">
                                <h4>시공이력</h4>
                                <div>
                                    <div className="reviewBox">
                                        <img src="/review01.png"/>
                                        <span>xx도 xx시 xx구 24평 / 2042만원</span>
                                    </div>

                                    <div className="reviewBox">
                                        <img src="/review02.png"/>
                                        <span>xx도 xx시 xx구 28평 / 3749만원</span>
                                    </div>

                                    <div className="reviewBox">
                                        <img src="/review03.png"/>
                                        <span>xx도 xx시 xx구 24평 / 1056만원</span>
                                    </div>
                                    
                                    <div className="reviewBox">
                                        <img src="/review04.png"/>
                                        <span>xx도 xx시 xx구 28평 / 4062만원</span>
                                    </div>

                                    <div className="reviewBox">
                                        <img src="/review05.png"/>
                                        <span>xx도 xx시 xx구 24평 / 1968만원</span>
                                    </div>

                                    <div className="reviewBox">
                                        <img src="/review06.png"/>
                                        <span>xx도 xx시 xx구 28평 / 843만원</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="biddingDetailBtn">
                            <form action="/api/counseling" method="POST">
                                <input style = {{display : 'none'}}name = "_id" defaultValue={props.params.route}/>
                                <button type="submit">상담하기</button>
                            </form>
                            <BackBtn/>
                        </div>
                    </div>
                )

            }
                
        }
    }
    return Home()
}
