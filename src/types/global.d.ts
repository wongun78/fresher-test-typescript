export {};

declare global {
  interface IBackendRes<T> {
    statusCode: number | string;
    message: string;
    data?: T;
    error?: string | string[];
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  interface IUser {
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    id: string;
  }

  interface ILogin {
    access_token: string;
    user: IUser;
  }
  interface IRegister {
    _id: string;
    email: string;
    fullName: string;
  }

  interface IFetchAccount {
    user: IUser;
  }

  interface IUserTable {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    avatar?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IResponseImport {
    countSuccess: number;
    countError: number;
    detail: any;
  }

  interface IBookTable {
    _id: string;
    thumbnail: string;
    slider: string[];
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface ICart {
    _id: string;
    quantity: number;
    detail: IBookTable;
  }
}
