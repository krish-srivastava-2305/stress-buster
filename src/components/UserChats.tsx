// /Chat.tsx
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketProvider";

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
  id: string; // current user's ID
}

const UserChats: React.FC<Props> = ({ id }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newText, setNewText] = useState<string>("");

  const { sendMessage, messages: socketMessages, joinRoom } = useSocket();

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

      // setMessages((prev) => [
      //   ...prev,
      //   {
      //     content: newText,
      //     position: "right",
      //     timestamp: new Date().toLocaleString(),
      //   },
      // ]);

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
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 text-white p-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatSelection(chat.users.find((u) => u.id !== id)?.id || "", chat.id)}
            className="flex items-center p-3 cursor-pointer hover:bg-gray-800"
          >
            <p className="text-sm font-semibold">
              {chat.users.find((user) => user.id !== id)?.anonyName}
            </p>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="w-3/4 bg-gray-800 text-white flex flex-col">
        {selectedChat && (
          <>
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">
                {chats.find((chat) => chat.id === selectedChat)?.users.find((user) => user.id !== id)?.anonyName}
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.position === "right" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${message.position === "right" ? "bg-blue-600" : "bg-gray-700"}`}>
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700 flex">
              <input
                type="text"
                className="flex-1 bg-gray-900 p-2 rounded-l-lg text-white"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTextSend()}
              />
              <button onClick={handleTextSend} className="bg-blue-500 p-2 rounded-r-lg">Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserChats;
