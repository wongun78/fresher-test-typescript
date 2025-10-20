import { Modal, Tabs } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import UserInfo from "./user.info";
import ChangePassword from "./change.password";

interface IProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

const ManageAccount = (props: IProps) => {
  const { openModal, setOpenModal } = props;

  const handleCancel = () => {
    setOpenModal(false);
  };

  const items = [
    {
      key: "info",
      label: <span>Profile</span>,
      children: <UserInfo />,
    },
    {
      key: "password",
      label: <span>Change Password</span>,
      children: <ChangePassword />,
    },
  ];

  return (
    <Modal
      title="Manage Account"
      open={openModal}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Tabs defaultActiveKey="info" items={items} />
    </Modal>
  );
};

export default ManageAccount;
