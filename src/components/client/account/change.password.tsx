import { App, Form, Input, Button } from "antd";
import { updateUserPasswordAPI } from "@/services/api";
import { useState } from "react";
import { LockOutlined } from "@ant-design/icons";
import { userCurrentApp } from "@/components/context/app.context";

type FieldType = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword = () => {
  const { message } = App.useApp();
  const { user } = userCurrentApp();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: FieldType) => {
    try {
      setIsSubmitting(true);

      if (!user?.email) {
        message.error("User email is required!");
        return;
      }

      const response = await updateUserPasswordAPI(
        user.email,
        values.oldPassword,
        values.newPassword
      );

      if (response?.data) {
        message.success("Password changed successfully!");
        form.resetFields();
      } else {
        message.error("Failed to change password. Please try again!");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Network error. Please try again!";
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Form
        form={form}
        name="changePassword"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Current Password"
          name="oldPassword"
          rules={[
            { required: true, message: "Please input your current password!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your current password"
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please input your new password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your new password"
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm your new password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting} block>
            {isSubmitting ? "Changing Password..." : "Change Password"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
