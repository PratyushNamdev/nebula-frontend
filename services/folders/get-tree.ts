import API from "../instance";
import { GetFolderTreeResponseDTO } from "./dto/res/get-folder-tree.dto";
export const getFolderTree = async () => {
  const { data } = await API.get<GetFolderTreeResponseDTO>("/folders/tree");
  return data.tree;
};
