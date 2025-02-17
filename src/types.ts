export type user = {
  _id: number;
  name: string;
  accessToken?: string;
  refreshToken?: string;
  email?: string;
  image?: string;
  type?: string;
  phone?: string;
  address?: string;
  extra: UserExtra;
  password: string;
};

type UserExtra = {
  birth?: string;
  gender?: string;
  userName?: string;
};

export interface UserStore {
  user: user | null;
  setUser: (user: user) => void;
  resetUser: () => void;
}

type mainImages = {
  name: string;
  originalname: string;
  path: string;
};

type extra = {
  bestMonth?: number[] | null;
  bestSeason?: number[] | null;
  sale: number;
  saledPrice: number;
  rating: number;
};

export interface ProductData {
  bookmarks: number;
  buyQuantity: number;
  createdAt: string | Date;
  name: string;
  price: number;
  extra: extra;
  mainImages: mainImages[];
  options: number;
  replies: number;
  seller: user;
  seller_id: number;
  shippingFees: number;
  updatedAt: string | Date;
  _id: number;
  content: string;
}

export interface BoardData {
  bookmarks: number;
  content: string;
  createdAt: string;
  image?: string;
  repliesCount: number;
  type: string;
  updatedAt: string | Date;
  user: user;
  _id: number;
}

export interface OrderData {
  _id: number;
  products: ProductData[];
  state: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

export type SetHeaderContents = {
  headerContents: object;
  setHeaderContents: React.Dispatch<React.SetStateAction<object>>;
};
