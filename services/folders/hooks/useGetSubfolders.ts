import { useQuery } from "@tanstack/react-query";
import { getSubfolders } from "../get-subfolders";
export const useGetSubfolders = (path: string = "/") => {
  return useQuery({
    queryKey: ["subfolders", path],
    queryFn: () => getSubfolders(path),
  });
};
