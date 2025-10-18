import { getUsersAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import {
  EllipsisOutlined,
  PlusOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Dropdown, Tag, Avatar } from "antd";
import { useRef, useState } from "react";
import DetailUser from "./detail.user";
import CreateUser from "./create.user";
import ImportUser from "./data/import.user";

type TSearch = {
  fullName?: string;
  email?: string;
  createdAt?: string;
  createdAtRange?: string;
};

const TableUser = () => {
  const actionRef = useRef<ActionType>();

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalImport, setOpenModalImport] = useState<boolean>(false);

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const columns: ProColumns<IUserTable>[] = [
    {
      title: "STT",
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Id",
      dataIndex: "_id",
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              setDataViewDetail(record);
              setOpenViewDetail(true);
            }}
            href="#"
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      search: false,
      width: 80,
      render: (_, record) => (
        <Avatar size={40} src={record.avatar} icon={<UserOutlined />} />
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      copyable: true,
      ellipsis: true,
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
      title: "Email",
      dataIndex: "email",
      copyable: true,
      ellipsis: true,
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
      title: "Phone",
      dataIndex: "phone",
      search: false,
    },
    {
      title: "Role",
      dataIndex: "role",
      filters: true,
      onFilter: true,
      ellipsis: true,
      hideInSearch: true,
      valueType: "select",
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
        <Tag color={record.role === "ADMIN" ? "orange" : "default"}>
          {record.role}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      filters: true,
      onFilter: true,
      valueType: "select",
      hideInSearch: true,
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
        <Tag color={record.isActive ? "green" : "red"}>
          {record.isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      key: "createdAt",
      dataIndex: "createdAt",
      valueType: "dateRange",
      hideInSearch: true,
      sorter: true,
      render: (_, record) => {
        const date = new Date(record.createdAt);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      title: "Actions",
      valueType: "option",
      key: "option",
      render: (_text, record, _index, action) => [
        <Button
          key="editable"
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            action?.startEditable?.(record._id);
          }}
        />,
      ],
    },
  ];

  return (
    <div>
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          try {
            let query = "";
            if (params) {
              query += `current=${params.current}&pageSize=${params.pageSize}`;
              if (params.email) {
                query += `&email=/${params.email}/i`;
              }
              if (params.fullName) {
                query += `&fullName=/${params.fullName}/i`;
              }

              //   const createdDateRange = dateRangeValidate(params.createdAtRange);
              //   if (createdDateRange) {
              //     query += `&createdAt>=${createdDateRange[0]}&createdAt<=${createdDateRange[1]}`;
              //   }

              query += `&sort=-createdAt`;

              if (sort && sort.createdAt) {
                query += `&sort=${
                  sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
                }`;
              }
            }
            const res = await getUsersAPI(query);

            if (res.data?.meta) {
              setMeta(res.data.meta);
            }

            return {
              data: res.data?.result || [],
              success: true,
              total: res.data?.meta?.total || 0,
            };
          } catch (error) {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        editable={{
          type: "multiple",
        }}
        columnsState={{
          persistenceKey: "user-table-columns",
          persistenceType: "localStorage",
          defaultValue: {
            option: { fixed: "right", disable: true },
          },
        }}
        rowKey="_id"
        search={{
          labelWidth: "auto",
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
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => (
            <span>{`${range[0]}-${range[1]} of ${total} users`}</span>
          ),
          onChange: () => {
            actionRef.current?.reload();
          },
          onShowSizeChange: () => {
            actionRef.current?.reload();
          },
        }}
        dateFormatter="string"
        headerTitle="User Management"
        toolBarRender={() => [
          <Button
            key="add-user"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
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
                  icon: <UserOutlined />,
                },
                {
                  label: "Import Users",
                  key: "import",
                  icon: <PlusOutlined />,
                },
              ],
              onClick: (menuInfo) => {
                if (menuInfo.key === "import") {
                  setOpenModalImport(true);
                }
              },
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
      <DetailUser
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <CreateUser
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      <ImportUser
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
        refreshTable={refreshTable}
      />
    </div>
  );
};

export default TableUser;
