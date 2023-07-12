'use client';

export default async function BackBtn() {
    return (
        <button onClick={() => { history.go(-1)}}>닫기</button>
    )
} 