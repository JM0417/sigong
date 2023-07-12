import Link from "next/link"
import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"
import { connectDB } from "@/util/database"
import Home from "@/app/page"
import { ObjectId } from "mongodb"



// 메인 페이지

export default async function Comunity(props) {
    let session = await getServerSession(authOptions)

    const db = (await connectDB).db("capstone")
    let result = await db.collection('comunity').findOne({_id : new ObjectId(props.params.route)})
    let member = await db.collection('member').findOne({_id : new ObjectId(result.user_id)})
    let coment = await db.collection('coment').find({content_id : props.params.route}).toArray()
    coment.reverse()

    if(session){
        let today = new Date();   
        let now = `${today.getFullYear()}.${today.getMonth()+1}.${today.getDate()}`
        return(
            <div>
                <div className="comunityDetail">
                    <div className="comunityDetailTitle">
                        <h4>{result.title}</h4>
                        <span>{result.time}</span>
                        <span>{result.length}</span>
                    </div>
                    <div className="comunityDetailUser">
                        <img src="/user.png"/>
                        <span>{member.name}</span>
                    </div>
                    <div className="comunityDetailContent">
                        <span>{result.content}</span>
                        <img src={"/"+result.image}/>
                    </div>
                    <div className="comunityDetailComentWrite">
                        <form action="/api/comunityComentWrite" method="POST">
                            <input name="user_name" style={{display:"none"}} defaultValue={session.user.name}/>
                            <input name="content_id" style={{display:"none"}} defaultValue={props.params.route}/>
                            <input name="time" style={{display:"none"}} defaultValue={now}/>
                            <textarea name="content"/>
                            <button>작성</button>
                        </form>
                    </div>
                    <div className="comunityDetailComent">
                        {
                            coment.map((a,i)=>
                                <div className="comunityDetailComentBox">
                                    <div className="comunityDetailComentBoxUser">
                                        <img src="/user.png"/>
                                        <span>{coment[i].user_name}</span>
                                        <span>{coment[i].time}</span>
                                    </div>
                                    <div className="comunityDetailComentBoxContent">
                                        <span>{coment[i].content}</span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
    return Home()
}
