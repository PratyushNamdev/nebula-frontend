import { useQuery } from "@tanstack/react-query";
import { getFolderTree } from "../get-tree";

export const useGetFolderTree = () => {
  return useQuery({
    queryKey: ["folder-tree"],
    queryFn: getFolderTree,
  });
};
