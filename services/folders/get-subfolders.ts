import API from "../instance";
import { GetSubfoldersResponseDTO } from "./dto/res/get-subfolders.dto";

export const getSubfolders = async (path: string = "/") => {
  const { data } = await API.get<GetSubfoldersResponseDTO>(
    "/folders/contents",
    {
      params: { path },
    }
  );
  return data;
};
