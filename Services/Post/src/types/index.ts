export type DateTime = string;

export interface IUser {
  id: string;
  username?: string;
  email?: string;
  profile_picture?: string;
  isFollowed?: boolean;
}

export interface IPost {
  id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  createdBy: IUser;
  likeCount: number;
  dislikeCount: number;
  createdAt: DateTime;
  likedByUser?: boolean;
  dislikedByUser?: boolean;
}

export interface IComment {
  id: string;
  content: string;
  parentId?: string;
  associatedTo: string;
  createdBy: IUser;
  likeCount: number;
  dislikeCount: number;
  createdAt: DateTime;
  likedByUser?: boolean;
  dislikedByUser?: boolean;
}

export interface ILike {
  id: string;
  on: string;
  likedBy: string;
}

export interface IDislike {
  id: string;
  on: string;
  dislikedBy: string;
}

export interface IFollow {
  id: string;
  follower: IUser;
  following: IUser;
}
