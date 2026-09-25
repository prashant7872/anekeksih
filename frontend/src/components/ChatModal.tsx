import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Lock } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface ChatModalProps {
  bookingId: string;
  currentUser: User | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  bookingId,
  currentUser,
  onClose,
  onShowToast,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChat();
    const interval = setInterval(loadChat, 4000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChat = async () => {
    try {
      const res = await api.getChat(bookingId);
      setMessages(res.chat?.messages || []);
      setChatInfo(res.chat?.booking);
      setLoading(false);
    } catch (err) {
      // If chat not created yet, graceful empty list
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    try {
      const res = await api.sendMessage(bookingId, text);
      setMessages((prev) => [...prev, res.message]);
    } catch (err: any) {
      onShowToast(`Failed to send: ${err.message}`);
    }
  };

  const otherPersonName =
    currentUser?.role === 'WORKER'
      ? chatInfo?.customer?.user?.name || 'Customer'
      : chatInfo?.worker?.user?.name || 'Worker-Owner';

  const otherInitials = otherPersonName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="chat-overlay show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="chat-card">
        <div className="chat-head">
          <div className="chat-head-avatar">{otherInitials || 'AE'}</div>
          <div>
            <div className="chat-head-name">{otherPersonName}</div>
            <div className="chat-head-sub">
              <Lock size={10} /> <span>Masked chat — numbers stay private</span>
            </div>
          </div>
          <button className="chat-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="chat-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#9a917f', fontSize: '12px' }}>
              Loading masked conversation...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: '#9a917f', fontSize: '12px' }}>
              Say hello! Your real phone number is protected.
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderId === currentUser?.id;
              const timeStr = new Date(m.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={m.id} className={`chat-bubble ${isMe ? 'me' : 'them'}`}>
                  <div>{m.message}</div>
                  <div className="chat-time">{timeStr}</div>
                </div>
              );
            })
          )}
          <div ref={chatBottomRef} />
        </div>

        <div className="chat-privacy-note">
          Messages route through AnekEk cooperative gateway — personal phone numbers are never exposed.
        </div>

        <form onSubmit={handleSend} className="chat-input-row">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" className="chat-send-btn">
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
