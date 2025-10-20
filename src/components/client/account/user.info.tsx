import { App, Form, Input, Button, Upload, Avatar, Row, Col } from "antd";
import { updateUserInfoAPI, uploadFileAPI } from "@/services/api";
import { useState } from "react";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { userCurrentApp } from "@/components/context/app.context";

type FieldType = {
  fullName: string;
  email: string;
  phone: string;
};

const UserInfo = () => {
  const { message } = App.useApp();
  const { user, setUser } = userCurrentApp();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState<string>(user?.avatar || "");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUpload = async (file: any) => {
    try {
      const res = await uploadFileAPI(file, "avatar");
      if (res?.data?.fileUploaded) {
        setAvatar(res.data.fileUploaded);
        message.success("Avatar uploaded successfully!");
        return false; // Prevent default upload behavior
      }
    } catch (error: any) {
      message.error("Failed to upload avatar!");
    }
    return false;
  };

  const handleSubmit = async (values: FieldType) => {
    try {
      setIsSubmitting(true);

      if (!user?._id) {
        message.error("User ID is required!");
        return;
      }

      const response = await updateUserInfoAPI(
        user._id,
        avatar,
        values.fullName,
        values.phone
      );

      if (response?.data) {
        message.success("Profile updated successfully!");
        // Update user in context
        setUser?.({
          ...user,
          fullName: values.fullName,
          phone: values.phone,
          avatar: avatar,
        });
      } else {
        message.error("Failed to update profile. Please try again!");
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

  const avatarURL = avatar
    ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${avatar}`
    : user?.avatar
    ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`
    : null;

  return (
    <div style={{ padding: "24px" }}>
      <Form
        form={form}
        name="userInfo"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{
          fullName: user?.fullName || "",
          email: user?.email || "",
          phone: user?.phone || "",
        }}
      >
        <Row gutter={24}>
          <Col span={24} style={{ textAlign: "center", marginBottom: "24px" }}>
            <Avatar
              size={100}
              src={avatarURL || undefined}
              icon={<UserOutlined />}
              style={{
                backgroundColor: !avatarURL ? "#1890ff" : undefined,
                marginBottom: "16px",
              }}
            />
            <div>
              <Upload
                beforeUpload={handleUpload}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                maxCount={1}
                accept="image/*"
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Change Avatar</Button>
              </Upload>
            </div>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType>
              label="Email"
              name="email"
              tooltip="Email cannot be changed"
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType>
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Please input your full name!" },
                {
                  min: 2,
                  message: "Full name must be at least 2 characters!",
                },
                {
                  max: 100,
                  message: "Full name must not exceed 100 characters!",
                },
              ]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>
          </Col>

          <Col span={24}>
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
          </Col>

          <Col span={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                block
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UserInfo;
