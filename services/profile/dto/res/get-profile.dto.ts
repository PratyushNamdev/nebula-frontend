export interface GetProfileResponseDTO {
  id: string;
  username: string;
  email: string;
  profilePic: string;
  isPremium: boolean;
  plan: string;
  storage: {
    used: number;
    limit: number;
    percentage: string;
  };
  rootFolderId: string;
}
