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
    <header
      style={{ borderBottom: "1px solid #d9d9d9", backgroundColor: "#fff" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
          }}
        >
          {/* Logo & Brand */}
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#1890ff",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOutlined style={{ color: "white", fontSize: "20px" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                Classic Books
              </h1>
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                Literary Collection
              </p>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Link to="/" style={{ color: "#333", textDecoration: "none" }}>
              Home
            </Link>
            <Link to="/book" style={{ color: "#333", textDecoration: "none" }}>
              Books
            </Link>
            <Link to="/about" style={{ color: "#333", textDecoration: "none" }}>
              About
            </Link>
          </nav>

          {/* User Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Shopping Cart */}
            <Button
              type="text"
              icon={
                <Badge count={3} size="small">
                  <ShoppingCartOutlined style={{ fontSize: "20px" }} />
                </Badge>
              }
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
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span
                    style={{
                      maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.fullName || user.email}
                  </span>
                </Button>
              </Dropdown>
            ) : (
              <Space>
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
                <Link to="/register">
                  <Button type="primary">Register</Button>
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
