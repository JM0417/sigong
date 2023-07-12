'use client';

import { signIn } from 'next-auth/react'

export default async function LoginBtn() {
    return <button onClick={() => { signIn() }}>로그인</button>
} 