import {
  EllipsisOutlined,
  PlusOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Tag, Avatar } from "antd";
import { useRef } from "react";
import { type UserItem, waitTime } from "./data";

const TableUser = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<UserItem>[] = [
    {
      title: <span className="!text-amber-900 !font-bold">STT</span>,
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
      className: "!text-amber-800",
    },
    {
      title: <span className="!text-amber-900 !font-bold">Avatar</span>,
      dataIndex: "avatar",
      search: false,
      width: 80,
      render: (_, record) => (
        <Avatar
          size={40}
          src={record.avatar}
          icon={<UserOutlined />}
          className="!bg-amber-600 !border-2 !border-amber-800"
        />
      ),
    },
    {
      title: <span className="!text-amber-900 !font-bold">Full Name</span>,
      dataIndex: "fullName",
      copyable: true,
      ellipsis: true,
      tooltip: "Full name of the user",
      className: "!text-amber-800 !font-medium",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Full name is required",
          },
        ],
      },
    },
    {
      title: <span className="!text-amber-900 !font-bold">Email</span>,
      dataIndex: "email",
      copyable: true,
      ellipsis: true,
      className: "!text-amber-800",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Email is required",
          },
          {
            type: "email",
            message: "Please enter a valid email",
          },
        ],
      },
    },
    {
      title: <span className="!text-amber-900 !font-bold">Phone</span>,
      dataIndex: "phone",
      search: false,
      className: "!text-amber-800",
    },
    {
      title: <span className="!text-amber-900 !font-bold">Role</span>,
      dataIndex: "role",
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: "select",
      className: "!text-amber-800",
      valueEnum: {
        USER: {
          text: "User",
          status: "Default",
        },
        ADMIN: {
          text: "Admin",
          status: "Success",
        },
      },
      render: (_, record) => (
        <Tag
          color={record.role === "ADMIN" ? "orange" : "default"}
          className={`!border-amber-600 ${
            record.role === "ADMIN"
              ? "!bg-amber-100 !text-amber-800"
              : "!bg-gray-100 !text-gray-700"
          }`}
        >
          {record.role}
        </Tag>
      ),
    },
    {
      title: <span className="!text-amber-900 !font-bold">Status</span>,
      dataIndex: "isActive",
      filters: true,
      onFilter: true,
      valueType: "select",
      className: "!text-amber-800",
      valueEnum: {
        true: {
          text: "Active",
          status: "Success",
        },
        false: {
          text: "Inactive",
          status: "Error",
        },
      },
      render: (_, record) => (
        <Tag
          color={record.isActive ? "green" : "red"}
          className={`!border-2 ${
            record.isActive
              ? "!border-green-500 !bg-green-50 !text-green-700"
              : "!border-red-500 !bg-red-50 !text-red-700"
          }`}
        >
          {record.isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    // {
    //   title: <span className="!text-amber-900 !font-bold">Created At</span>,
    //   key: "showTime",
    //   dataIndex: "createdAt",
    //   valueType: "date",
    //   sorter: true,
    //   hideInSearch: true,
    //   className: "!text-amber-800",
    // },
    {
      title: (
        <span className="!text-amber-900 !font-bold">Created Date Range</span>
      ),
      dataIndex: "createdAt",
      valueType: "dateRange",
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: <span className="!text-amber-900 !font-bold">Actions</span>,
      valueType: "option",
      key: "option",
      className: "!text-amber-800",
      render: (_text, record, _index, action) => [
        <Button
          key="editable"
          type="link"
          icon={<EditOutlined />}
          className="!text-amber-700 hover:!text-amber-900 !font-medium"
          onClick={() => {
            action?.startEditable?.(record._id);
          }}
        ></Button>,
        <Button
          key="view"
          type="link"
          icon={<UserOutlined />}
          className="!text-blue-600 hover:!text-blue-800 !font-medium"
          onClick={() => {
            console.log("View user:", record);
          }}
        ></Button>,
        <TableDropdown
          key="actionGroup"
          onSelect={(key) => {
            if (key === "delete") {
              console.log("Delete user:", record);
            }
            action?.reload();
          }}
          menus={[
            {
              key: "copy",
              name: "Copy User",
              icon: <UserOutlined className="!text-amber-600" />,
            },
            {
              key: "delete",
              name: "Delete User",
              icon: <DeleteOutlined className="!text-red-600" />,
            },
          ]}
        />,
      ],
    },
  ];

  return (
    <div className="!bg-gradient-to-b !from-amber-50 !to-orange-50">
      <ProTable<UserItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        className="!bg-white !border-2 !border-amber-300 !rounded-lg !shadow-lg !p-4"
        request={async (params, sort, filter) => {
          console.log("Request params:", params, sort, filter);
          await waitTime(1000);

          const mockUsers: UserItem[] = [
            {
              _id: "1",
              fullName: "John Doe",
              email: "john.doe@example.com",
              phone: "+1234567890",
              role: "ADMIN",
              avatar: "",
              isActive: true,
              createdAt: "2024-01-15",
              updatedAt: "2024-01-15",
            },
            {
              _id: "2",
              fullName: "Jane Smith",
              email: "jane.smith@example.com",
              phone: "+1234567891",
              role: "USER",
              avatar: "",
              isActive: true,
              createdAt: "2024-01-16",
              updatedAt: "2024-01-16",
            },
            {
              _id: "3",
              fullName: "Bob Wilson",
              email: "bob.wilson@example.com",
              phone: "+1234567892",
              role: "USER",
              avatar: "",
              isActive: false,
              createdAt: "2024-01-17",
              updatedAt: "2024-01-17",
            },
          ];

          return {
            data: mockUsers,
            success: true,
            total: mockUsers.length,
          };
        }}
        editable={{
          type: "multiple",
          onSave: async (rowKey, data, row) => {
            console.log("Save user:", rowKey, data, row);
            await waitTime(1000);
          },
          onDelete: async (rowKey, data) => {
            console.log("Delete user:", rowKey, data);
            await waitTime(1000);
          },
        }}
        columnsState={{
          persistenceKey: "user-table-columns",
          persistenceType: "localStorage",
          defaultValue: {
            option: { fixed: "right", disable: true },
          },
          onChange(value) {
            console.log("Columns state changed:", value);
          },
        }}
        rowKey="_id"
        search={{
          labelWidth: "auto",
          className: "!bg-amber-50 !border !border-amber-200 !rounded-lg",
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          syncToUrl: (values, type) => {
            if (type === "get") {
              return {
                ...values,
                createdAt: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => (
            <span className="!text-amber-800 !font-medium">
              {`${range[0]}-${range[1]} of ${total} users`}
            </span>
          ),
          onChange: (page) => console.log("Page changed:", page),
        }}
        dateFormatter="string"
        headerTitle={
          <div className="flex items-center space-x-3">
            <span className="!text-2xl !font-bold !text-amber-900 !font-serif">
              User Management
            </span>
          </div>
        }
        toolBarRender={() => [
          <Button
            key="add-user"
            icon={<PlusOutlined />}
            onClick={() => {
              console.log("Add new user");
              actionRef.current?.reload();
            }}
            type="primary"
            className="!bg-amber-600 !border-amber-600 hover:!bg-amber-700 hover:!border-amber-700 !font-medium !rounded-lg !shadow-lg"
            style={{
              boxShadow: "2px 2px 0px #92400e",
            }}
          >
            Add New User
          </Button>,
          <Dropdown
            key="more-actions"
            menu={{
              items: [
                {
                  label: "Export Users",
                  key: "export",
                  icon: <UserOutlined className="!text-amber-600" />,
                },
                {
                  label: "Import Users",
                  key: "import",
                  icon: <PlusOutlined className="!text-amber-600" />,
                },
                {
                  label: "Bulk Actions",
                  key: "bulk",
                  icon: <EllipsisOutlined className="!text-amber-600" />,
                },
              ],
              onClick: (e) => {
                console.log("Dropdown action:", e.key);
              },
            }}
          >
            <Button className="!border-2 !border-amber-600 !text-amber-800 hover:!bg-amber-100 !rounded-lg">
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
    </div>
  );
};

export default TableUser;
