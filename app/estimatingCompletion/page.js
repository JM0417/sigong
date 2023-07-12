import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth";
import { connectDB } from "@/util/database"
import Link from "next/link"
import Home from "@/app/page"

export default async function estimatingCompletion() {

    let session = await getServerSession(authOptions)

    if(session){
        const db = (await connectDB).db("capstone")
        let result = await db.collection('member').find({type : "business"}).toArray()

            if(session.user.type == "customer"){

                return(
                    <div className="estimatingCompletion">
                        <h4>견적내기</h4>
                        <img src="completion.png"/>
                        <span>요청하신 견적을 {result.length}개의 업체에게 성공적으로 전달하였습니다.</span>
                        <Link href={"/"} className="linkMainPage">돌아가기</Link>
                    </div>
                )
            }        
        } 
        return Home()
    }