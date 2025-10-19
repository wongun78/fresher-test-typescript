import { App, Form, Modal, Input, Button } from "antd";
import { updateUserAPI } from "@/services/api";
import { useState, useEffect } from "react";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (open: boolean) => void;
  refreshTable: () => void;
  dataUpdate: IUserTable | null;
  setDataUpdate: (data: IUserTable | null) => void;
}

type FieldType = {
  _id?: string;
  fullName: string;
  phone: string;
  email: string;
};

const UpdateUser = (props: IProps) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    dataUpdate,
    setDataUpdate,
  } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (openModalUpdate && dataUpdate) {
      form.setFieldsValue({
        _id: dataUpdate._id,
        fullName: dataUpdate.fullName,
        phone: dataUpdate.phone,
        email: dataUpdate.email,
      });
    }
  }, [openModalUpdate, dataUpdate, form]);

  const handleSubmit = async (values: FieldType) => {
    try {
      setIsSubmitting(true);

      if (!dataUpdate?._id) {
        message.error("User ID is required!");
        return;
      }

      const response = await updateUserAPI(
        dataUpdate._id,
        values.fullName,
        values.phone
      );

      if (response?.data) {
        message.success("User updated successfully!");
        handleCancel();
        refreshTable();
      } else {
        message.error("Failed to update user. Please try again!");
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
    setOpenModalUpdate(false);
    setDataUpdate(null);
  };

  return (
    <Modal
      title="Update User"
      open={openModalUpdate}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        name="UpdateUser"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item<FieldType> name="_id" hidden>
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="Email" name="email">
          <Input placeholder="Email cannot be changed" disabled />
        </Form.Item>

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
            {isSubmitting ? "Updating User..." : "Update User"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateUser;
