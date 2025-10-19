import axios from "./axios.customize";

export const loginAPI = (username: string, password: string) => {
  return axios.post<IBackendRes<ILogin>>("/api/v1/auth/login", {
    username,
    password,
  });
};

export const registerAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  return axios.post<IBackendRes<IRegister>>("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};

export const fetchAccountAPI = () => {
  return axios.get<IBackendRes<IFetchAccount>>("/api/v1/auth/account");
};

export const logoutAPI = () => {
  return axios.post<IBackendRes<ILogin>>("/api/v1/user/logout");
};

export const getUsersAPI = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(
    `/api/v1/user?${query}`
  );
};

export const createUserAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  return axios.post<IBackendRes<IRegister>>(`/api/v1/user`, {
    fullName,
    email,
    password,
    phone,
  });
};

export const bulkCreateUserAPI = (
  users: { fullName: string; email: string; password: string; phone: string }[]
) => {
  return axios.post<IBackendRes<IResponseImport>>(`/api/v1/user/bulk-create`, {
    users,
  });
};

export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
  return axios.put<IBackendRes<IRegister>>(`/api/v1/user`, {
    _id,
    fullName,
    phone,
  });
};

export const deleteUserAPI = (_id: string) => {
  return axios.delete<IBackendRes<IRegister>>(`/api/v1/user/${_id}`);
};

export const getBooksAPI = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(
    `/api/v1/book?${query}`
  );
};

export const getCategoryAPI = () => {
  return axios.get<IBackendRes<string[]>>("/api/v1/database/category");
};

export const createBookAPI = (
  mainText: string,
  author: string,
  price: number,
  category: string,
  quantity: number,
  sold?: number,
  thumbnail?: string,
  slider?: string[]
) => {
  return axios.post<IBackendRes<IBookTable>>("/api/v1/book", {
    mainText,
    author,
    price,
    category,
    quantity,
    sold,
    thumbnail,
    slider,
  });
};

export const uploadFileAPI = (fileImg: any, folder: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios<
    IBackendRes<{
      fileUploaded: string;
    }>
  >({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": folder,
    },
  });
};

export const updateBookAPI = (
  _id: string,
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string,
  thumbnail: string,
  slider: string[]
) => {
  const urlBackend = `/api/v1/book/${_id}`;
  return axios.put<IBackendRes<IRegister>>(urlBackend, {
    mainText,
    author,
    price,
    quantity,
    category,
    thumbnail,
    slider,
  });
};

export const deleteBookAPI = (_id: string) => {
  const urlBackend = `/api/v1/book/${_id}`;
  return axios.delete<IBackendRes<IRegister>>(urlBackend);
};
