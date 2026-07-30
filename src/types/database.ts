export type UserRole = "ADMIN" | "USER";

export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
};

export type PostImage = {
  image: string;
};

export type Post = {
  id: string;
  title: string;
  description: string;
  author: string;
  authorImage: PostImage | null;
  categoryId: string | null;
  postImages: PostImage[];
  postDate: Date | null;
  showInHome: boolean;
  createdAt: Date;
  updatedAt: Date;
};
