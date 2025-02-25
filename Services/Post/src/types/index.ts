export interface IPost {
  id: string;
  title: string;
  content: string;
  mediaUrl: string;
  createdBy: string;
  createdAt: Date;
}
export interface IComment {
  id: string;
  content: string;
  parentId?: string;
  associatedTo: string;
  createdAt: Date;
  createdBy: string;
}
