'use client';

import { signOut } from 'next-auth/react'

export default async function LogOutBtn() {
    return (
        <button onClick={() => {signOut();}}>로그아웃</button>
    )
} 