import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../get";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};
