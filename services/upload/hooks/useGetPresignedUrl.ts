import { useMutation } from "@tanstack/react-query";
import { getPresignedUrl } from "../get-presigned-url";
import { GetPresignedUrlRequestDTO } from "../dto/req/get-presigned-url.dto";

export const useGetPresignedUrl = () => {
  return useMutation({
    mutationFn: (request: GetPresignedUrlRequestDTO) =>
      getPresignedUrl(request),
  });
};
