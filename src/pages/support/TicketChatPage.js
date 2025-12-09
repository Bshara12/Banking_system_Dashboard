// src/pages/support/TicketChatPage.js
import { useEffect, useState, useRef } from "react";
import "./chat.css";
import { SupportAPI } from "../../api/support.api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function TicketChatPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      const res = await SupportAPI.getTicket(id);
      const t = res.data.ticket;

      // تأكد أن الرسالة الأساسية تدخل ضمن الـ messages
      const rootMsg = {
        id: t.id,
        message: t.message, // الحقل الأساسي في الداتا
        sender_type: "user",
        created_at: t.created_at,
      };

      const children = (t.children || []).map((m) => ({
        id: m.id,
        message: m.message ?? m.content ?? m.body ?? "", // حماية لو اسم الحقل مختلف
        sender_type: m.sender_type || "staff",
        created_at: m.created_at || m.updated_at || null,
      }));

      // رتب الرسائل حسب الوقت (واتساب يظهر الأقدم أولاً)
      const all = [rootMsg, ...children].sort((a, b) => {
        const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
        return ta - tb;
      });

      setTicket(t);
      setMessages(all);

      await SupportAPI.changeStatus(id, "read");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load chat");
    }
  }

  // Scroll إلى الأسفل عند كل تغيير في الرسائل
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendReply() {
    if (!reply.trim() || !ticket) return;

    try {
      const body = {
        title: ticket.title, // backend عندك يحتاج العنوان مع الرد
        message: reply,
      };

      const res = await SupportAPI.replyToTicket(id, body);

      // بعض الـ APIs ترجع داخل res.data.message أو res.data.data
      const payload =
        res?.data?.message ||
        res?.data?.data ||
        res?.data ||
        {
          id: Date.now(),
          message: reply,
          sender_type: "staff",
          created_at: new Date().toISOString(),
        };

      const newMsg = {
        id: payload.id ?? Date.now(),
        message: payload.message ?? payload.content ?? payload.body ?? reply,
        sender_type: payload.sender_type || "staff",
        created_at: payload.created_at || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMsg]);
      setReply("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  }

  function formatTime(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  return (
    <div className="chat-container">
      {ticket && (
        <div className="chat-header">
          <div className="chat-title">
            <h2>{ticket.title}</h2>
            <span className={`status-chip ${ticket.status}`}>{ticket.status}</span>
          </div>
        </div>
      )}

      <div className="chat-box" ref={chatRef}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`msg-bubble ${m.sender_type === "staff" ? "staff" : "user"}`}
          >
            <div className="msg-content">{m.message}</div>
            <div className="msg-meta">
              <span className="msg-time">{formatTime(m.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="اكتب رسالة..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendReply()}
        />
        <button onClick={sendReply}>إرسال</button>
      </div>
    </div>
  );
}