import API from "../instance";
import { GetProfileResponseDTO } from "./dto/res/get-profile.dto";

export const getProfile = async () => {
  const { data } = await API.get<GetProfileResponseDTO>("/profile");
  return data;
};
