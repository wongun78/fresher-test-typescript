import {
  Drawer,
  Avatar,
  Tag,
  Descriptions,
  Space,
  Button,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  SafetyOutlined,
  EditOutlined,
} from "@ant-design/icons";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IUserTable | null;
  setDataViewDetail: (v: IUserTable | null) => void;
}

const DetailUser = (props: IProps) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  const avatarURL = dataViewDetail?.avatar
    ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
        dataViewDetail.avatar
      }`
    : null;

  return (
    <Drawer
      width={720}
      onClose={onClose}
      open={openViewDetail}
      extra={
        <Space>
          <Button icon={<EditOutlined />} type="primary">
            Edit User
          </Button>
        </Space>
      }
    >
      {dataViewDetail && (
        <div style={{ padding: "24px 0" }}>
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #f0f0f0",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                marginBottom: "24px",
              }}
            >
              <Avatar
                size={80}
                src={avatarURL || undefined}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: !avatarURL ? "#1890ff" : undefined,
                }}
              >
                {!avatarURL &&
                  dataViewDetail?.fullName &&
                  dataViewDetail.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
              </Avatar>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "0 0 8px 0",
                  }}
                >
                  {dataViewDetail.fullName}
                </h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Tag
                    color={
                      dataViewDetail.role === "ADMIN" ? "orange" : "default"
                    }
                  >
                    {dataViewDetail.role}
                  </Tag>
                  <Tag color={dataViewDetail.isActive ? "green" : "red"}>
                    {dataViewDetail.isActive ? "Active" : "Inactive"}
                  </Tag>
                </div>
              </div>
            </div>

            <Divider />

            <div style={{ marginBottom: "24px" }}>
              <h4
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MailOutlined style={{ marginRight: "8px" }} />
                Contact Information
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #e8e8e8",
                    borderRadius: "6px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <MailOutlined style={{ marginRight: "8px" }} />
                    <span style={{ fontWeight: "medium" }}>Email</span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "monospace",
                      fontSize: "14px",
                      wordBreak: "break-all",
                    }}
                  >
                    {dataViewDetail.email}
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #e8e8e8",
                    borderRadius: "6px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <PhoneOutlined style={{ marginRight: "8px" }} />
                    <span style={{ fontWeight: "medium" }}>Phone</span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "monospace",
                      fontSize: "14px",
                    }}
                  >
                    {dataViewDetail.phone}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SafetyOutlined style={{ marginRight: "8px" }} />
                System Information
              </h4>
              <Descriptions bordered column={1} size="middle">
                <Descriptions.Item
                  label={
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <UserOutlined style={{ marginRight: "8px" }} />
                      User ID
                    </span>
                  }
                >
                  <span style={{ fontFamily: "monospace", fontSize: "14px" }}>
                    {dataViewDetail._id}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <CalendarOutlined style={{ marginRight: "8px" }} />
                      Created Date
                    </span>
                  }
                >
                  {new Date(dataViewDetail.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <CalendarOutlined style={{ marginRight: "8px" }} />
                      Last Updated
                    </span>
                  }
                >
                  {new Date(dataViewDetail.updatedAt).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default DetailUser;
