export interface GetFolderByPathResponseDTO {
  _id: string;
  name: string;
  path: string;
  parentFolderId: string | null;
  userId: string;
  isRoot?: boolean;
  createdAt: string;
  updatedAt: string;
}
