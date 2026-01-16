export interface GetSubfoldersResponseDTO {
  currentFolder: {
    id: string;
    name: string;
    path: string;
  };
  folders: Array<{
    _id: string;
    name: string;
    path: string;
    createdAt: string;
  }>;
  counts: {
    folders: number;
  };
}
