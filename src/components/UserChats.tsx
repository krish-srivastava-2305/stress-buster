import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSocket } from "@/context/SocketProvider";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Message {
  content: string;
  position: "left" | "right";
  timestamp: string;
}

interface Chat {
  id: string;
  users: Array<{ id: string; anonyName: string; avatarUrl: string }>;
}

interface Props {
  id: string;
}

const UserChats: React.FC<Props> = ({ id }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newText, setNewText] = useState<string>("");
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, messages: socketMessages, joinRoom } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await axios.get(`/api/user/user-chats?id=${id}`);
        setChats(res.data.chatRooms);
      } catch (error) {
        console.error("Error fetching chats", error);
      }
    };
    getChats();
  }, [id]);

  const handleChatSelection = async (receiverId: string, roomId: string) => {
    setSelectedChat(receiverId);
    joinRoom(id, receiverId);

    try {
      const res = await axios.get(`/api/chat/get-messages?roomId=${roomId}`);
      const data = res.data.messages.map((msg: any) => ({
        content: msg.content,
        position: msg.user.id === id ? "right" : "left",
        timestamp: new Date(msg.createdAt).toLocaleString(),
      }));
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      const newMessages = socketMessages
        .filter((msg) => msg.roomId.includes(selectedChat) && !messages.some(m => m.content === msg.message))
        .map((msg) => ({
          content: msg.message,
          position: msg.senderId === id ? "right" as "right" : "left" as "left",
          timestamp: new Date().toLocaleString(),
        }));
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    }
  }, [socketMessages, selectedChat, id]);

  const handleTextSend = async () => {
    if (newText && selectedChat) {
      sendMessage(newText, id, selectedChat);

      try {
        const roomId = [id, selectedChat].sort().join("__");
        const res = await axios.post(`/api/chat/save-message`, {roomId, message: newText});
        if(res.status !== 201){
          console.error("Error sending message", res.data.error);
        }
      } catch (error) {
        console.error("Error sending message", error);
      }
      setNewText("");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0f172a]">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-800">
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-lg font-semibold text-white">Messages</h1>
        </div>
        <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-4rem)]">
          {chats.map((chat) => {
            const otherUser = chat.users.find((u) => u.id !== id);
            return (
              <div
                key={chat.id}
                onClick={() => handleChatSelection(otherUser?.id || "", chat.id)}
                className={`flex items-center p-4 cursor-pointer transition-colors
                  ${selectedChat === chat.id ? 'bg-gray-800' : 'hover:bg-gray-800/50'}`}
              >
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                  {otherUser?.anonyName.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">{otherUser?.anonyName}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-5 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                {chats.find((chat) => chat.users.some(u => u.id === selectedChat))
                  ?.users.find((user) => user.id !== id)?.anonyName}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.position === "right" ? "justify-end" : "justify-start"}`}>
                  <div 
                    className={`max-w-md rounded-2xl px-4 py-2 ${
                      message.position === "right" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-800 text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-60">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              {/* Invisible div for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTextSend()}
                />
                <button 
                  onClick={handleTextSend} 
                  className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <FaArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserChats;