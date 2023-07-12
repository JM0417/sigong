import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"
import Home from "@/app/page"

export default async function ComunityWrite(props) {

    let session = await getServerSession(authOptions)

    if(session){

        let today = new Date();   
        let now = `${today.getFullYear()}.${today.getMonth()+1}.${today.getDate()}`

        return(
            <div>
                <div className="comunityWrite">
                    <h4>글 작성하기</h4>
                    <div className="comunityInput">
                        <form action="/api/comunityWrite" method="POST">
                            <input name="user_id" style={{display:"none"}} defaultValue={session.user._id}/>
                            <input name="user_type" style={{display:"none"}} defaultValue={session.user._type}/>
                            <input name="user_name" style={{display:"none"}} defaultValue={session.user._name}/>
                            <input name="time" style={{display:"none"}} defaultValue={now}/>
                            <input className="CWtitle" name="title" placeholder="제목을 입력하여 주세요" required/>
                            <input className="CWfile" type="file" name="image" accept="image/*"/>
                            <textarea className="CWcontent" name="content" placeholder="글 내용" required/>
                            <button type="submit">작성하기</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
    return Home()
}
