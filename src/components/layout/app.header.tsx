import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button, Dropdown, Space, message } from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BookOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { logoutAPI } from "@/services/api";
import { userCurrentApp } from "../context/app.context";
import CartPopover from "./cart.popover";
import ManageAccount from "../client/account";
import { useState } from "react";

const AppHeader = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    carts,
    setCarts,
  } = userCurrentApp();
  const [openManageAccount, setOpenManageAccount] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await logoutAPI();
      if (res.data) {
        message.success("Logged out successfully!");
      }
    } catch (error) {
      console.log("Logout error:", error);
      message.warning("Logged out from client");
    } finally {
      // Always clear client-side data regardless of API response
      setUser?.(null);
      setIsAuthenticated?.(false);
      localStorage.removeItem("access_token");
      localStorage.removeItem("carts");
      setCarts?.([]);
      navigate("/");
    }
  };

  const handleUpdateQuantity = (bookId: string, quantity: number) => {
    const updatedCarts = carts.map((cart) => {
      if (cart._id === bookId) {
        return { ...cart, quantity };
      }
      return cart;
    });
    setCarts?.(updatedCarts);
    localStorage.setItem("carts", JSON.stringify(updatedCarts));
    message.success("Cập nhật số lượng thành công");
  };

  const handleRemoveItem = (bookId: string) => {
    const updatedCarts = carts.filter((cart) => cart._id !== bookId);
    setCarts?.(updatedCarts);
    localStorage.setItem("carts", JSON.stringify(updatedCarts));
    message.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => setOpenManageAccount(true),
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

          {/* User Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Shopping Cart */}
            <CartPopover
              carts={carts}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
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

      <ManageAccount
        openModal={openManageAccount}
        setOpenModal={setOpenManageAccount}
      />
    </header>
  );
};

export default AppHeader;
