import { App, Form, Modal, Input, Button } from "antd";
import { createUserAPI } from "@/services/api";
import { useState } from "react";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (open: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};

const CreateUser = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: FieldType) => {
    try {
      setIsSubmitting(true);
      const response = await createUserAPI(
        values.fullName,
        values.email,
        values.password,
        values.phone
      );

      if (response?.data) {
        message.success("User created successfully!");
        form.resetFields();
        setOpenModalCreate(false);
        refreshTable();
      } else {
        message.error("Failed to create user. Please try again!");
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

  const handleCancel = () => {
    form.resetFields();
    setOpenModalCreate(false);
  };

  return (
    <Modal
      title="Create New User"
      open={openModalCreate}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        name="createUser"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Full Name"
          name="fullName"
          rules={[
            { required: true, message: "Please input the full name!" },
            { min: 2, message: "Full name must be at least 2 characters!" },
            { max: 100, message: "Full name must not exceed 100 characters!" },
          ]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: "Please input the email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please input the phone number!" },
            {
              pattern: /^[0-9]{10,11}$/,
              message: "Phone number must be 10-11 digits!",
            },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input the password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "24px",
          }}
        >
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {isSubmitting ? "Creating User..." : "Create User"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUser;
