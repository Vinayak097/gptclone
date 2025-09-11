import { backend_url } from "@/config";
import { useQuery } from "@tanstack/react-query";

export function useMessage(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => {
      return fetch(`${backend_url}/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
  });
}
