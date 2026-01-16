export interface FolderTreeNode {
  _id: string;
  name: string;
  path: string;
  parentFolderId: string | null;
  isRoot: boolean;
  children: FolderTreeNode[];
}

export interface GetFolderTreeResponseDTO {
  tree: FolderTreeNode[];
}
