import { backend_url } from "@/config";
import { useQuery } from "@tanstack/react-query";

export default function useConversation() {
  return useQuery({
    queryKey: ["usechat"],
    queryFn: async () => {
      fetch(`${backend_url}/conversations`).then((res) => {
        if (!res.ok) {
          throw new Error("failed to fetch conversations");
        }
        return res.json();
      });
    },
  });
}
