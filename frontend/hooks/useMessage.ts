import { backend_url } from "@/config";
import { useQuery } from "@tanstack/react-query";

export function useMessage(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      console.log("Fetching messages for:", conversationId);

      if (!conversationId) return [];

      const res = await fetch(
        `${backend_url}/conversations/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await res.json();

      return data.messages;
    },
    enabled: !!conversationId,
  });
}
