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
        message.success("Welcome back to our classic book collection!");
        navigate("/");
      } else {
        notification.error({
          message: "Login Failed",
          description:
            response.message && Array.isArray(response.message)
              ? response.message[0]
              : response.message ||
                "An unexpected error occurred. Please try again.",
          duration: 5,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Login Error",
        description:
          error?.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
        duration: 5,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center py-8 px-4 relative overflow-hidden">
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

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Header with Book Icon */}
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-amber-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-amber-800">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-amber-900 mb-2 font-serif tracking-wider">
            Book Access
          </h2>
          <p className="text-amber-700 font-medium tracking-wide">
            Sign in to your classic collection
          </p>
        </div>

        {/* Main Form Container */}
        <div
          className="bg-gradient-to-b from-amber-50 to-white border-4 border-amber-800 rounded-none shadow-2xl p-8 relative"
          style={{
            boxShadow: "8px 8px 0px #92400e, 12px 12px 0px #451a03",
          }}
        >
          {/* Decorative corners */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-4 border-t-4 border-amber-800"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-r-4 border-t-4 border-amber-800"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-4 border-b-4 border-amber-800"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-4 border-b-4 border-amber-800"></div>

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item<FieldType>
              label={
                <span className="text-amber-900 font-bold text-sm tracking-wide uppercase">
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
                placeholder="Enter your username"
                className="border-2 border-amber-600 rounded-none h-12 px-4 text-amber-900 font-medium hover:border-amber-700 focus:border-amber-800 shadow-inner"
                style={{
                  boxShadow: "inset 2px 2px 4px rgba(146, 64, 14, 0.2)",
                  backgroundColor: "#fffbeb",
                }}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label={
                <span className="text-amber-900 font-bold text-sm tracking-wide uppercase">
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
                placeholder="Enter your password"
                className="border-2 border-amber-600 rounded-none h-12 px-4 text-amber-900 font-medium hover:border-amber-700 focus:border-amber-800 shadow-inner"
                style={{
                  boxShadow: "inset 2px 2px 4px rgba(146, 64, 14, 0.2)",
                  backgroundColor: "#fffbeb",
                }}
              />
            </Form.Item>

            <Form.Item className="mb-4 mt-8">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-14 text-lg font-bold tracking-wider uppercase border-4 border-amber-800 rounded-none text-white relative overflow-hidden"
                style={{
                  backgroundColor: "#d97706",
                  boxShadow: "4px 4px 0px #92400e, 8px 8px 0px #451a03",
                  fontFamily: "serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-2px, -2px)";
                  e.currentTarget.style.boxShadow =
                    "6px 6px 0px #92400e, 10px 10px 0px #451a03";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0, 0)";
                  e.currentTarget.style.boxShadow =
                    "4px 4px 0px #92400e, 8px 8px 0px #451a03";
                }}
              >
                Sign In
              </Button>
            </Form.Item>

            <div className="text-center border-t-2 border-amber-200 pt-6">
              <span className="text-amber-800 font-medium">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-amber-900 hover:text-amber-700 underline decoration-2 decoration-amber-600"
                >
                  Create one here
                </Link>
              </span>
            </div>
          </Form>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-amber-800">
            <span className="font-serif text-sm tracking-wider">
              Classic Book Store
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
