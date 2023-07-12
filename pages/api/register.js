import { connectDB } from "@/util/database"
import bcrypt from "bcrypt";

export default async function handler(req, res){

    if(req.method == "POST"){
        // 아이디 비번 입력 확인
        if(req.body.id == ''){
            return res.status(500).json('아이디를 입력해주세요')
        }
        if(req.body.password == ''){
            return res.status(500).json('비밀번호를 입력해주세요')
        }
        if(req.body.name == ''){
            return res.status(500).json('비밀번호를 입력해주세요')
        }

        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;

        const db = (await connectDB).db("capstone")
        let result = await db.collection('member').findOne({id : req.body.id})

        if(result != null){
            return res.status(500).json('중복된 아이디 입니다.')
        }

        try {
            let resultInsert = await db.collection('member').insertOne(req.body)
            
            res.redirect(302, '/')

        } catch (error) {
            return res.status(500).json('아이디나 비밀번호가 일치하지 않습니다.')
        }
        
    }
    
}

