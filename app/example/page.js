'use client'
import { useEffect, useState } from 'react';

export default function Example({data}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (response.status === 201) {
        console.log('메시지 전송 완료');
        setMessage('');
        location.reload();
      } else {
        console.log('메시지 전송 실패');
      }
    } catch (error) {
      console.log('서버 오류');
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/chat');

        if (response.status === 200) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.log('메시지 가져오기 실패');
        }
      } catch (error) {
        console.log('서버 오류');
      }
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <h1>채팅</h1>
      <div>
        {messages.map((msg, index) => (
            <div key={index}>{msg.message}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type='text' name = "user_id" defaultValue={data.user_id} style={{display : "none"}}/>
        <input type='text' name = "user_type" defaultValue={data.user_type} style={{display : "none"}}/>
        <input type='text' name = "bidding_id" defaultValue={data.bidding_id} style={{display : "none"}}/>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{display : "none"}}
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
}
