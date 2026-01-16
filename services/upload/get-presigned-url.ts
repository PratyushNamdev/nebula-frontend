import API from "../instance";
import { GetPresignedUrlRequestDTO } from "./dto/req/get-presigned-url.dto";
import { GetPresignedUrlResponseDTO } from "./dto/res/get-presigned-url.dto";

export const getPresignedUrl = async (
  request: GetPresignedUrlRequestDTO
): Promise<GetPresignedUrlResponseDTO> => {
  const { data } = await API.post<GetPresignedUrlResponseDTO>(
    "/upload/get-presigned-url",
    request
  );
  return data;
};
