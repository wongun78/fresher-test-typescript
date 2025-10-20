import { createContext, useContext, useState, useEffect } from "react";
import { fetchAccountAPI } from "../../services/api";
import { PacmanLoader } from "react-spinners";

interface IAppContext {
  isAuthenticated: boolean;
  setIsAuthenticated?: (v: boolean) => void;
  user: IUser | null;
  setUser?: (v: IUser | null) => void;
  isAppLoading: boolean;
  setIsAppLoading?: (v: boolean) => void;
  carts: ICart[];
  setCarts: (carts: ICart[]) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
  children: React.ReactNode;
};

export const AppProvider = (props: TProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [carts, setCarts] = useState<ICart[]>([]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetchAccountAPI();
        const carts = localStorage.getItem("carts");
        if (res?.data) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          if (carts) {
            setCarts(JSON.parse(carts) as ICart[]);
          }
        }
      } catch (error) {
      } finally {
        setIsAppLoading(false);
      }
    };
    fetchAccount();
  }, []);

  if (isAppLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <PacmanLoader color="#1677ff" size={25} />
        <p style={{ marginTop: "20px", color: "#666" }}>Loading...</p>
      </div>
    );
  }

  return (
    <CurrentAppContext.Provider
      value={{
        isAuthenticated,
        user,
        setIsAuthenticated,
        setUser,
        isAppLoading,
        setIsAppLoading,
        carts,
        setCarts,
      }}
    >
      {props.children}
    </CurrentAppContext.Provider>
  );
};

export const userCurrentApp = () => {
  const currentUserContext = useContext(CurrentAppContext);
  if (!currentUserContext) {
    throw new Error("userCurrentApp must be used within a AppContext");
  }
  return currentUserContext;
};
