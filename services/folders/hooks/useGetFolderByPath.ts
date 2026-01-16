import { useQuery } from "@tanstack/react-query";
import { getFolderByPath } from "../get-folder-bypath";

export const useGetFolderByPath = (path: string = "/") => {
  return useQuery({
    queryKey: ["folder-by-path", path],
    queryFn: () => getFolderByPath(path),
  });
};
