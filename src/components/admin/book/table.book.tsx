import { getBooksAPI, deleteBookAPI } from "@/services/api";
import {
  EllipsisOutlined,
  PlusOutlined,
  EditOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Dropdown, Tag, App, Popconfirm, notification } from "antd";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import DetailBook from "./detail.book";
import CreateBook from "./create.book";
import UpdateBook from "./update.book";

type TSearch = {
  mainText?: string;
  author?: string;
  createdAt?: string;
  createdAtRange?: string;
};

const TableBook = () => {
  const actionRef = useRef<ActionType>();
  const { message } = App.useApp();

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);

  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleDeleteBook = async (props: IBookTable) => {
    const { _id } = props;
    try {
      const res = await deleteBookAPI(_id!);
      if (res.data) {
        message.success("Book deleted successfully!");
        refreshTable();
      } else {
        notification.error({
          message: "Delete Failed",
          description:
            res.message || "An unexpected error occurred. Please try again.",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Network error. Please try again!";
      notification.error({
        message: "Delete Failed",
        description: errorMessage,
      });
    }
  };

  const csvData = currentDataTable.map((book, index) => ({
    STT: index + 1,
    ID: book._id,
    "Main Text": book.mainText,
    Author: book.author,
    Price: book.price,
    Sold: book.sold,
    Quantity: book.quantity,
    Category: book.category,
    "Created At": new Date(book.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));

  const csvHeaders = [
    { label: "STT", key: "STT" },
    { label: "ID", key: "ID" },
    { label: "Main Text", key: "Main Text" },
    { label: "Author", key: "Author" },
    { label: "Price", key: "Price" },
    { label: "Sold", key: "Sold" },
    { label: "Quantity", key: "Quantity" },
    { label: "Category", key: "Category" },
    { label: "Created At", key: "Created At" },
  ];

  const columns: ProColumns<IBookTable>[] = [
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
      title: "Main Text",
      dataIndex: "mainText",
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Main text is required",
          },
        ],
      },
    },
    {
      title: "Author",
      dataIndex: "author",
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Author is required",
          },
        ],
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      search: false,
      render: (_, record) => <span>${record.price.toLocaleString()}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      filters: true,
      onFilter: true,
      ellipsis: true,
      hideInSearch: true,
      valueType: "select",
      valueEnum: {
        "Arts & Music": {
          text: "Arts & Music",
          status: "Default",
        },
        Biographies: {
          text: "Biographies",
          status: "Success",
        },
        Business: {
          text: "Business",
          status: "Processing",
        },
        Comics: {
          text: "Comics",
          status: "Warning",
        },
        "Computers & Tech": {
          text: "Computers & Tech",
          status: "Error",
        },
      },
      render: (_, record) => <Tag>{record.category}</Tag>,
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
      render: (_text, record, _index) => [
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            setDataUpdate(record);
            setOpenModalUpdate(true);
          }}
        />,
        <Popconfirm
          key="delete"
          title="Delete Book"
          description={`Are you sure you want to delete book "${record.mainText}"?`}
          onConfirm={() => handleDeleteBook(record)}
          okText="Delete"
          cancelText="Cancel"
          okType="danger"
        >
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <div>
      <ProTable<IBookTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          try {
            let query = "";
            if (params) {
              query += `current=${params.current}&pageSize=${params.pageSize}`;
              if (params.author) {
                query += `&author=/${params.author}/i`;
              }
              if (params.mainText) {
                query += `&mainText=/${params.mainText}/i`;
              }

              query += `&sort=-createdAt`;

              if (sort && sort.createdAt) {
                query += `&sort=${
                  sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
                } `;
              } else query += `&sort=-createdAt`;
            }
            const res = await getBooksAPI(query);

            if (res.data?.meta) {
              setMeta(res.data.meta);
              setCurrentDataTable(res.data.result ?? []);
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
          persistenceKey: "book-table-columns",
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
            <span>{`${range[0]}-${range[1]} of ${total} books`}</span>
          ),
          onChange: () => {
            actionRef.current?.reload();
          },
          onShowSizeChange: () => {
            actionRef.current?.reload();
          },
        }}
        dateFormatter="string"
        headerTitle="Book Management"
        toolBarRender={() => [
          <Button
            key="add-book"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Add New Book
          </Button>,
          <Dropdown
            key="more-actions"
            menu={{
              items: [
                {
                  label: (
                    <CSVLink
                      data={csvData}
                      headers={csvHeaders}
                      filename={`books_export_${
                        new Date().toISOString().split("T")[0]
                      }.csv`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <DownloadOutlined />
                      Export Books
                    </CSVLink>
                  ),
                  key: "export",
                },
              ],
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />

      <DetailBook
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <CreateBook
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      <UpdateBook
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </div>
  );
};

export default TableBook;
