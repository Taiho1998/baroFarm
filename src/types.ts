import { Product } from "@portone/browser-sdk/dist/v2/entity";

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
  image: mainImages;
};

export interface ProductData {
  bookmarks: number;
  buyQuantity: number;
  myBookmarkId: number;
  createdAt: string | Date;
  name: string;
  price: number;
  extra: extra;
  mainImages: mainImages[];
  image: mainImages;
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
  replies: ReplyData[];
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

export interface PayData {
  selectedItems?: { product: ProductData; quantity: number }[];
  totalFees?: number;
  memo?: { memo?: string };
  currentAddress?: {
    userName?: string;
    name?: string;
    phone?: string;
    value?: string;
  };
}

export interface ReviewData {
  _id: number;
  user_id: number;
  user: user;
  order_id: number;
  product_id: number;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  createdAt: string;
  extra: extra;
  product: ProductData;
}

export interface CartData {
  item: {
    product: ProductData;
    product_id: number;
    quantity: number;
    _id: number;
  }[];
  cost: {
    products: number;
    shippingFees: number;
    discount: {
      products: number;
      shippingFees: number;
    };
  };
}

export interface ReplyData {
  content: string;
  user: user;
  _id: number;
  createdAt: string;
}
