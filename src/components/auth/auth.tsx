import { Button, Result } from "antd";
import { userCurrentApp } from "../context/app.context";

interface IProps {
  children?: React.ReactNode;
}

const ProtectedRoute = (props: IProps) => {
  const { isAuthenticated, user } = userCurrentApp();

  if (isAuthenticated === false) {
    return (
      <>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={<Button type="primary">Back Home</Button>}
        />
      </>
    );
  }
  const isAdminRoute = location.pathname.startsWith("admin");
  if (isAuthenticated === true && isAdminRoute === true) {
    const role = user?.role;
    if (role !== "admin") {
      return (
        <>
          <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary">Back Home</Button>}
          />
        </>
      );
    }
  }
  return <>{props.children}</>;
};
export default ProtectedRoute;
