import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";

type FieldType = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      message.success("Register successfully!");
    } else {
      message.error(data.message || "Register failed!");
    }
  } catch (error) {
    message.error("Network error. Please try again!");
  }
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  message.error("Please check your input!");
};

const RegisterPage: React.FC = () => (
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
          Book Registry
        </h2>
        <p className="text-amber-700 font-medium tracking-wide">
          Join our classic book collection
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
          name="register"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          size="large"
        >
          <Form.Item<FieldType>
            label={
              <span className="text-amber-900 font-bold text-sm tracking-wide uppercase">
                Full Name
              </span>
            }
            name="fullName"
            rules={[
              { required: true, message: "Please input your full name!" },
              {
                min: 2,
                message: "Full name must be at least 2 characters!",
              },
            ]}
          >
            <Input
              placeholder="Enter your full name"
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
                Email Address
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              placeholder="Enter your email"
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
                Phone Number
              </span>
            }
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Phone number must be 10-11 digits!",
              },
            ]}
          >
            <Input
              placeholder="Enter your phone number"
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
              Create Account
            </Button>
          </Form.Item>

          <div className="text-center border-t-2 border-amber-200 pt-6">
            <span className="text-amber-800 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-amber-900 hover:text-amber-700 underline decoration-2 decoration-amber-600"
              >
                Sign in here
              </Link>
            </span>
          </div>
        </Form>
      </div>

      {/* Footer decoration */}
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

export default RegisterPage;
