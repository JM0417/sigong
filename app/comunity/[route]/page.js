import Link from "next/link"
import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"
import { connectDB } from "@/util/database"
import Home from "@/app/page"


// 메인 페이지

export default async function Comunity(props) {
    let session = await getServerSession(authOptions)

    const db = (await connectDB).db("capstone")
    let result = await db.collection('comunity').find().toArray()
    result.reverse()

    let pageNumber = []
    for(let i = 1; i<result.length/3+1; i++){
        pageNumber[i-1] = i
    }

    if(session){
        return(
            <div>
                <div className="comunity">
                    <h3>커뮤니티</h3>
                    {
                        result.map((a,i)=>
                            <Link href={`comunityDetail/${result[i]._id}`} className="comunityBoxLink">
                                <div className="comunityBox">
                                    <div className="comunityBoxIndexBox">
                                        <h4>{result[i].title}</h4>
                                        <p>{result[i].content}</p>
                                    </div>
                                    <div className="comunityBoxImageBox">
                                        <img src={"/"+result[i].image}/>
                                    </div>
                                    <div className="comunityBoxLastBox">
                                        <span>댓글 {}</span>
                                        <span>{result[i].time}</span>
                                    </div>
                                </div>
                            </Link>
                        ).slice((props.params.route-1)*3,props.params.route*3)
                    }
                </div>
                <div className="comunityPageNumber">
                    {
                        pageNumber.map((a,i)=>
                            <Link href={`/comunity/${i+1}`}>{i+1}</Link>
                        )
                    }
                </div>
                <div className="comunityWriteBtn">
                    <Link href={`/comunityWrite/${session.user._id}`}>글쓰기</Link>
                </div>
            </div>
        )
    }
    return Home()
}
