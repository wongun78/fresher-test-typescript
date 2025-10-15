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
  return axios.post("/api/v1/user/register", {
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
  return axios.post("/api/v1/user/logout");
};
