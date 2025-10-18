import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, App } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerAPI } from "@/services/api";

type FieldType = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const response = await registerAPI(
        values.fullName,
        values.email,
        values.password,
        values.phone
      );

      if (response.statusCode === 201 || response.statusCode === "201") {
        message.success("Welcome to our classic book collection!");
        navigate("/login");
      } else {
        message.error(response.message || "Register failed!");
      }
    } catch (error: any) {
      message.error("Network error. Please try again!");
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
            Book Registry
          </h2>
          <p style={{ color: "#666" }}>Join our classic book collection</p>
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
            name="register"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item<FieldType>
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Please input your full name!" },
                {
                  min: 2,
                  message: "Full name must be at least 2 characters!",
                },
              ]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please input your phone number!" },
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: "Phone number must be 10-11 digits!",
                },
              ]}
            >
              <Input placeholder="Enter your phone number" />
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
                Create Account
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
                Already have an account?{" "}
                <Link to="/login" style={{ fontWeight: "bold" }}>
                  Sign in here
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

export default RegisterPage;
