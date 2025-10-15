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
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
  children: React.ReactNode;
};

export const AppProvider = (props: TProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      if (res?.data) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
      setIsAppLoading(false);
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
        }}
      >
        <PacmanLoader loading={isAppLoading} size={30} />
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
