import Link from "next/link"
import { connectDB } from "@/util/database"
// 메인 페이지

export default async function Home() {

  const db = (await connectDB).db("capstone")
  let result = await db.collection('comunity').find().toArray()
  result.reverse()

  return (
    <div>
      <div className="banner1">
        <h2>3D인테리어부터 시공까지</h2>
        <h2>시공그린과 함께</h2>
        <h2>꿈꾸는 공간을 현실로 만들어보세요</h2>
        <Link href={'#'}>견적내기</Link>
      </div>
      <div className="banner2">
        <img src={'/banner2.png'}/>
      </div>
      <div className="layout3">
        <h4>시공사례</h4>
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
        <Link href={""} className="mainPageMore">더 보기</Link>
      </div>
      <div className="layout4">
        <h4>커뮤니티</h4>
        <div>
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
            ).slice(0,3)
          }
        </div>
        <Link href={""} className="mainPageMore">더 보기</Link>
      </div>
    </div>
  )
}
