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
          <Link to="/" className="flex items-center space-x-1 !text-amber-800">
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
    <Layout className="!min-h-screen">
      {/* Fixed Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        collapsedWidth={80}
        className={`
          !fixed !left-0 !top-0 !bottom-0 !z-40
          !h-screen !overflow-y-auto
          !bg-gradient-to-b !from-amber-50 !to-orange-100 
          !border-r-4 !border-amber-800
          ${collapsed ? "!w-20" : "!w-64"}
          !transition-all !duration-200
        `}
      >
        {/* Logo Section */}
        <div className="!h-16 flex items-center justify-center !border-b-2 !border-amber-800 !bg-amber-600">
          <div className="flex items-center space-x-3">
            <div className="!w-8 !h-8 !bg-white rounded-lg flex items-center justify-center">
              <BookOutlined className="!text-amber-600 !text-lg" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="!text-white !font-bold !font-serif !text-lg">
                  Admin Panel
                </h2>
                <p className="!text-amber-100 !text-xs -mt-1">
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
          className="!bg-transparent !border-none !mt-4"
        />
      </Sider>

      {/* Main Layout */}
      <Layout
        className={`!transition-all !duration-200 ${
          collapsed ? "!ml-20" : "!ml-64"
        }`}
      >
        {/* Fixed Header */}
        <Header
          className={`
          !fixed !top-0 !right-0 !z-30
          !bg-gradient-to-r !from-amber-50 !to-orange-100 
          !border-b-4 !border-amber-800 !shadow-lg
          !px-4 flex justify-between items-center
          !transition-all !duration-200
          ${collapsed ? "!left-20" : "!left-64"}
        `}
        >
          {/* Left: Toggle & Breadcrumb */}
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="!w-10 !h-10 flex items-center justify-center hover:!bg-amber-200 !border-2 !border-transparent hover:!border-amber-600 !rounded-lg !transition-all !text-amber-800"
            />
            <Breadcrumb
              items={getBreadcrumbItems()}
              className="!text-amber-800 !font-medium"
            />
          </div>

          {/* Right: User Profile */}
          <div className="flex items-center space-x-4">
            {/* Brand Info */}
            <div className="hidden lg:block !text-right">
              <h3 className="!text-amber-900 !font-bold !font-serif !text-lg">
                Classic Books
              </h3>
              <p className="!text-amber-700 !text-xs -mt-1">
                Administration Panel
              </p>
            </div>

            {/* User Dropdown */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                className="flex items-center space-x-2 !px-3 !py-2 !h-10 hover:!bg-amber-200 !border-2 !border-transparent hover:!border-amber-600 !rounded-lg !transition-all"
              >
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  className="!bg-amber-600"
                />
                <Space
                  direction="vertical"
                  size={0}
                  className="hidden sm:block"
                >
                  <span className="!text-amber-900 !font-medium !text-sm">
                    {user?.fullName || "Admin"}
                  </span>
                  <span className="!text-amber-700 !text-xs">
                    {user?.role || "Administrator"}
                  </span>
                </Space>
              </Button>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content
          className={`
          !mt-16 !min-h-screen !relative !overflow-hidden
          !bg-gradient-to-b !from-amber-50 !to-orange-50
        `}
        >
          {/* Background Pattern */}
          <div className="!absolute !inset-0 !opacity-5">
            <div
              className="!absolute !inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          <div className="!relative !z-10 !p-6">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
