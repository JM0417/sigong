import Home from "@/app/page"
import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth";

export default async function Register() {
  let session = await getServerSession(authOptions)
  
  if(session){
    return Home()
  }else{
    return (
      <div>
        <div className="registerBox">
          <form action="/api/register" method="POST">
            <p>유형</p>
            <select name="type" type="text">
                <option value="business">사업자</option>
                <option value="customer">고객</option>
            </select>
            <p>닉네임</p>
            <input name="name" type="text" placeholder="닉네임" required/>
            <p>아이디</p>
            <input name="id" type="text" placeholder="아이디" required/>
            <p>비밀번호</p>
            <input name="password" type="password" placeholder="비밀번호" required/>
            <button type="submit">회원가입</button>
          </form>
        </div>
      </div>
    )
  }
}
