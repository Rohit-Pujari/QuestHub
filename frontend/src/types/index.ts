type DateTime = string;

export interface IUser {
  id: string;
  username: string;
  profile_picture?: string;
  isFollowed: boolean;
}
export interface IPost {
  id: string;
  title: string;
  content: string;
  mediaUrl: string;
  createdBy: IUser;
  likeCount: number;
  dislikeCount: number;
  createdAt: DateTime;
  likedByUser: boolean;
  dislikedByUser: boolean;
}

export interface IComment {
  id: string;
  content: string;
  parentId: string;
  associatedTo: string;
  createdBy: IUser;
  likeCount: number;
  dislikeCount: number;
  createdAt: DateTime;
  likedByUser: boolean;
  dislikedByUser: boolean;
}
