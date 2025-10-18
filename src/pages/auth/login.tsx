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
  const { message, notification } = App.useApp();
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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              margin: "0 auto 16px",
              width: "64px",
              height: "64px",
              backgroundColor: "#1890ff",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{ width: "32px", height: "32px", color: "white" }}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Book Access
          </h2>
          <p style={{ color: "#666" }}>Sign in to your classic collection</p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            padding: "32px",
          }}
        >
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item<FieldType>
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                { min: 2, message: "Username must be at least 2 characters!" },
              ]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters!",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item style={{ marginBottom: "16px", marginTop: "32px" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", height: "48px", fontSize: "16px" }}
              >
                Sign In
              </Button>
            </Form.Item>

            <div
              style={{
                textAlign: "center",
                borderTop: "1px solid #f0f0f0",
                paddingTop: "24px",
              }}
            >
              <span style={{ color: "#666" }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ fontWeight: "bold" }}>
                  Create one here
                </Link>
              </span>
            </div>
          </Form>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <span style={{ color: "#666", fontSize: "14px" }}>
            Classic Book Store
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
