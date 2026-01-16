import API from "../instance";
import { GetFolderByPathResponseDTO } from "./dto/res/get-folder-by-path.dto";

export const getFolderByPath = async (path: string = "/") => {
  const { data } = await API.get<GetFolderByPathResponseDTO>(
    "/folders/by-path",
    {
      params: { path },
    }
  );
  return data;
};
