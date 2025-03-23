import { Message } from "@/types";
import { useEffect, useRef, useState } from "react";

const useWebSocket = (userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL!.replace(/\/$/, ""); // Ensure no trailing slash
    const wsUrl = baseUrl.replace(/^http/, "ws") + "/ws";

    const connectWebSocket = () => {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        ws.current?.send(JSON.stringify({ type: "connect", userId }));
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      };

      ws.current.onclose = () => {
        console.warn("WebSocket closed. Reconnecting in 3s...");
        setTimeout(connectWebSocket, 3000);
      };

      ws.current.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.current?.close();
      };
    };

    // Delay WebSocket connection by 2 seconds
    const connectionTimeout = setTimeout(connectWebSocket, 2000);

    return () => {
      clearTimeout(connectionTimeout);
      ws.current?.close();
      ws.current = null;
    };
  }, [userId]);

  const sendMessage = (receiverId: string, content: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not open. Cannot send message.");
      return;
    }
    ws.current.send(
      JSON.stringify({ type: "message", userId, receiverId, content })
    );
  };

  return { messages, sendMessage };
};

export default useWebSocket;
