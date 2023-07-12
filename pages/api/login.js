import { connectDB } from "@/util/database"

export default async function handler(req, res){
    if(req.method == "POST"){
        // 아이디 비번 입력 확인
        if(req.body.id == ''){
            return res.status(500).json('아이디를 입력해주세요')
        }
        if(req.body.password == ''){
            return res.status(500).json('비밀번호를 입력해주세요')
        }

        try {
            const db = (await connectDB).db("capstone")
            let result = await db.collection('member').findOne({id : req.body.id, password : req.body.password})
            
            // type에 따라 두 가지 주소 경로로 나눔
            
            res.redirect(302,``)
            
        } catch (error) {
            return res.status(500).json('아이디나 비밀번호가 일치하지 않습니다.')
        }
        
    }
    
}