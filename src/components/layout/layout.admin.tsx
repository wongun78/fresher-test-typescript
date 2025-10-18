import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Breadcrumb,
  Space,
} from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  ShoppingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { userCurrentApp } from "../context/app.context";
import { logoutAPI } from "@/services/api";

const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, setUser, setIsAuthenticated } = userCurrentApp();

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res.data) {
      setUser?.(null);
      setIsAuthenticated?.(false);
      localStorage.removeItem("access_token");
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  const siderMenuItems: MenuProps["items"] = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/user",
      icon: <UserOutlined />,
      label: <Link to="/admin/user">Manage Users</Link>,
    },
    {
      key: "/admin/book",
      icon: <BookOutlined />,
      label: <Link to="/admin/book">Manage Books</Link>,
    },
    {
      key: "/admin/order",
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/order">Manage Orders</Link>,
    },
  ];

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbItems = [
      {
        title: (
          <Link to="/" className="flex items-center space-x-1">
            <span>Home</span>
          </Link>
        ),
      },
    ];

    if (pathSegments.length > 0) {
      breadcrumbItems.push({
        title: <span>Admin</span>,
      });

      if (pathSegments.length > 1) {
        const page = pathSegments[1];
        const pageNames: { [key: string]: string } = {
          user: "User Management",
          book: "Book Management",
          order: "Order Management",
        };
        breadcrumbItems.push({
          title: <span>{pageNames[page] || page}</span>,
        });
      }
    }

    return breadcrumbItems;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        collapsedWidth={80}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          height: "100vh",
          overflowY: "auto",
          backgroundColor: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
            backgroundColor: "#1890ff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "white",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
            </div>
            {!collapsed && (
              <div>
                <h2
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                    margin: 0,
                  }}
                >
                  Admin Panel
                </h2>
                <p style={{ color: "#b3d9ff", fontSize: "12px", margin: 0 }}>
                  Book Management
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={siderMenuItems}
          style={{
            backgroundColor: "transparent",
            border: "none",
            marginTop: "16px",
          }}
        />
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        {/* Header */}
        <Header
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            left: collapsed ? 80 : 250,
            zIndex: 999,
            backgroundColor: "#fff",
            borderBottom: "1px solid #f0f0f0",
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: Toggle & Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Breadcrumb items={getBreadcrumbItems()} />
          </div>

          {/* Right: User Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
                <Space direction="vertical" size={0}>
                  <span style={{ fontSize: "14px" }}>
                    {user?.fullName || "Admin"}
                  </span>
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    {user?.role || "Administrator"}
                  </span>
                </Space>
              </Button>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            marginTop: "64px",
            minHeight: "calc(100vh - 64px)",
            padding: "24px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
