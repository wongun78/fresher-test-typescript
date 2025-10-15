import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button, Dropdown, Space, Badge } from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  BookOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { logoutAPI } from "@/services/api";
import { userCurrentApp } from "../context/app.context";

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser, setIsAuthenticated } =
    userCurrentApp();

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res.data) {
      setUser?.(null);
      setIsAuthenticated?.(false);
      localStorage.removeItem("access_token");
      navigate("/");
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => navigate("/settings"),
    },
    ...(user?.role === "ADMIN"
      ? [
          {
            key: "admin",
            label: "Admin Dashboard",
            icon: <DashboardOutlined />,
            onClick: () => navigate("/admin"),
          },
        ]
      : []),
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <header className="bg-gradient-to-r from-amber-50 to-orange-100 border-b-4 border-amber-800 shadow-lg relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-amber-800 group-hover:bg-amber-700 transition-colors">
              <BookOutlined className="text-white text-xl" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold !text-amber-900 font-serif tracking-wider">
                Classic Books
              </h1>
              <p className="text-xs !text-amber-700 font-medium -mt-1">
                Literary Collection
              </p>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 !text-amber-800 hover:!text-amber-900 font-medium transition-colors group"
            >
              <span>Home</span>
            </Link>
            <Link
              to="/book"
              className="flex items-center space-x-2 !text-amber-800 hover:!text-amber-900 font-medium transition-colors group"
            >
              <span>Books</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center space-x-2 !text-amber-800 hover:!text-amber-900 font-medium transition-colors group"
            >
              <span>About</span>
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Shopping Cart */}
            <Button
              type="text"
              icon={
                <Badge count={3} size="small">
                  <ShoppingCartOutlined className="text-xl !text-amber-800" />
                </Badge>
              }
              className="flex items-center justify-center h-10 w-10 hover:bg-amber-200 border-2 border-transparent hover:border-amber-600 rounded-lg transition-all"
              onClick={() => navigate("/checkout")}
            />

            {isAuthenticated && user ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button
                  type="text"
                  className="flex items-center space-x-2 px-3 py-2 h-10 hover:bg-amber-200 border-2 border-transparent hover:border-amber-600 rounded-lg transition-all"
                >
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    className="bg-amber-600"
                  />
                  <span className="hidden sm:block !text-amber-900 font-medium max-w-24 truncate">
                    {user.fullName || user.email}
                  </span>
                </Button>
              </Dropdown>
            ) : (
              <Space>
                <Link to="/login">
                  <Button
                    type="default"
                    className="border-2 border-amber-600 !text-amber-800 font-medium hover:bg-amber-600 hover:text-white rounded-lg h-10 px-6 transition-all"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    type="primary"
                    className="bg-amber-600 border-amber-600 hover:bg-amber-700 hover:border-amber-700 font-medium rounded-lg h-10 px-6 shadow-lg"
                    style={{
                      boxShadow: "2px 2px 0px #92400e",
                    }}
                  >
                    Register
                  </Button>
                </Link>
              </Space>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
