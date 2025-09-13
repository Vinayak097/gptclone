import { backend_url } from "@/config";
import { useQuery } from "@tanstack/react-query";

export function useMessage(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      return fetch(`${backend_url}/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error("failed to fetch messages ");
        }
        return res.json();
      });
    },
    enabled: !!conversationId,
  });
}
