import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, App } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "@/services/api";
import { userCurrentApp } from "@/components/context/app.context";

type FieldType = {
  username: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { message, modal, notification } = App.useApp();
  const { setIsAuthenticated, setUser } = userCurrentApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const response = await loginAPI(values.username, values.password);

      if (response?.data) {
        setIsAuthenticated?.(true);
        setUser?.(response.data.user);
        localStorage.setItem("access_token", response.data.access_token);
        message.success("👻 Welcome to the haunted realm!");
        navigate("/");
      } else {
        notification.error({
          message: "Login Failed",
          description:
            response.message && Array.isArray(response.message)
              ? response.message[0]
              : response.message ||
                "💀 An unexpected error occurred. The ghosts are confused.",
          duration: 5,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Login Error",
        description:
          error?.response?.data?.message ||
          "💀 An unexpected error occurred. The ghosts are confused.",
        duration: 5,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 flex items-center justify-center py-8 px-4 relative overflow-hidden">
      {/* Spooky Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff6b35' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Floating Ghosts */}
      <div className="absolute top-20 left-10 text-4xl animate-bounce">👻</div>
      <div className="absolute top-40 right-20 text-3xl animate-pulse">🎃</div>
      <div className="absolute bottom-32 left-20 text-2xl animate-bounce">
        🦇
      </div>
      <div className="absolute bottom-20 right-10 text-3xl animate-pulse">
        💀
      </div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Header with Spooky Icon */}
        <div className="text-center">
          <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-purple-600 to-red-600 rounded-lg flex items-center justify-center shadow-lg border-4 border-orange-500 relative">
            <div className="text-4xl animate-pulse">🎃</div>
          </div>
          <h2 className="text-5xl font-bold text-orange-400 mb-2 font-serif tracking-wider drop-shadow-lg">
            Spooky Login
          </h2>
          <p className="text-purple-300 font-medium tracking-wide">
            Enter the haunted book realm
          </p>
        </div>

        {/* Main Form Container */}
        <div
          className="bg-gradient-to-b from-gray-800 to-black border-4 border-orange-500 rounded-none shadow-2xl p-8 relative"
          style={{
            boxShadow:
              "8px 8px 0px #ea580c, 12px 12px 0px #7c2d12, 0 0 30px rgba(234, 88, 12, 0.3)",
          }}
        >
          {/* Spooky decorative corners */}
          <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-red-500"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-red-500"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-red-500"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-red-500"></div>

          {/* Floating mini ghosts */}
          <div className="absolute top-4 left-6 text-xs animate-pulse">👻</div>
          <div className="absolute top-4 right-6 text-xs animate-bounce">
            🎃
          </div>

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item<FieldType>
              label={
                <span className="text-orange-400 font-bold text-sm tracking-wide uppercase flex items-center gap-2">
                  Username
                </span>
              }
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                { min: 2, message: "Username must be at least 2 characters!" },
              ]}
            >
              <Input
                placeholder="Enter your spooky username"
                className="border-2 border-orange-500 rounded-none h-12 px-4 text-orange-300 font-medium bg-gray-900 hover:border-red-500 focus:border-red-400"
                style={{
                  boxShadow:
                    "inset 2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(234, 88, 12, 0.2)",
                  backgroundColor: "#1f2937",
                }}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label={
                <span className="text-orange-400 font-bold text-sm tracking-wide uppercase flex items-center gap-2">
                  Password
                </span>
              }
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters!",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter your dark secret"
                className="border-2 border-orange-500 rounded-none h-12 px-4 text-orange-300 font-medium bg-gray-900 hover:border-red-500 focus:border-red-400"
                style={{
                  boxShadow:
                    "inset 2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(234, 88, 12, 0.2)",
                  backgroundColor: "#1f2937",
                }}
              />
            </Form.Item>

            <Form.Item className="mb-4 mt-8">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-14 text-lg font-bold tracking-wider uppercase border-4 border-red-600 rounded-none text-white relative overflow-hidden group"
                style={{
                  backgroundColor: "#dc2626",
                  boxShadow:
                    "4px 4px 0px #7f1d1d, 8px 8px 0px #451a03, 0 0 20px rgba(220, 38, 38, 0.4)",
                  fontFamily: "serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-2px, -2px)";
                  e.currentTarget.style.boxShadow =
                    "6px 6px 0px #7f1d1d, 10px 10px 0px #451a03, 0 0 30px rgba(220, 38, 38, 0.6)";
                  e.currentTarget.style.backgroundColor = "#b91c1c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0, 0)";
                  e.currentTarget.style.boxShadow =
                    "4px 4px 0px #7f1d1d, 8px 8px 0px #451a03, 0 0 20px rgba(220, 38, 38, 0.4)";
                  e.currentTarget.style.backgroundColor = "#dc2626";
                }}
              >
                Enter the Haunted Realm
              </Button>
            </Form.Item>

            <div className="text-center border-t-2 border-purple-600 pt-6">
              <span className="text-purple-300 font-medium">
                Don't have a spooky account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-orange-400 hover:text-red-400 underline decoration-2 decoration-orange-500 transition-colors"
                >
                  Create one here
                </Link>
              </span>
            </div>
          </Form>
        </div>

        {/* Footer decoration */}
        <div className="text-center">
          <div className="mt-2 text-purple-400 text-xs">
            Beware of the midnight reading sessions
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
