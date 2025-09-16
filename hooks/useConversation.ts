import { backend_url } from "@/config";
import { useQuery } from "@tanstack/react-query";

export default function useConversations() {
  return useQuery({
    queryKey: ["conversation"],
    queryFn: () => {
      return fetch(`${backend_url}/conversations`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("failed to fetch conversations");
        }
        return res.json(); // returns a Promise of the parsed data
      });
    },
  });
}
