import { Modal, Upload, Button, Table, App, Divider, notification } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { UploadFile, UploadProps } from "antd";
import * as ExcelJS from "exceljs";
import { bulkCreateUserAPI } from "@/services/api";
interface IProps {
  openModalImport: boolean;
  setOpenModalImport: (open: boolean) => void;
  refreshTable: () => void;
}

interface IUserImportData {
  key: string;
  fullName: string;
  email: string;
  phone: string;
}

const { Dragger } = Upload;

const ImportUser = (props: IProps) => {
  const { openModalImport, setOpenModalImport, refreshTable } = props;
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewData, setPreviewData] = useState<IUserImportData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCancel = () => {
    setFileList([]);
    setPreviewData([]);
    setOpenModalImport(false);
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      message.warning("Please upload and preview data first!");
      return;
    }

    setIsSubmitting(true);

    try {
      const dataSubmit = previewData.map((item) => ({
        ...item,
        password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD || "123456",
      }));

      const res = await bulkCreateUserAPI(dataSubmit);

      if (res.data) {
        notification.success({
          message: "Import Successful",
          description: `Successfully imported ${res.data.countSuccess} users. Error count: ${res.data.countError}.`,
        });
        refreshTable();
        handleCancel();
      } else {
        message.error("Import failed. Please try again.");
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Import failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    fileList,
    accept: ".xlsx,.xls",
    beforeUpload: (file) => {
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";

      if (!isExcel) {
        message.error("You can only upload Excel files!");
        return false;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("File must be smaller than 10MB!");
        return false;
      }

      processExcelFile(file);
      return false;
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
    customRequest: ({ onSuccess }) => {
      onSuccess?.("ok");
    },
  };

  const processExcelFile = async (file: File) => {
    try {
      message.loading("Processing Excel file...", 0);

      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      let jsonData: IUserImportData[] = [];

      workbook.worksheets.forEach(function (sheet) {
        let firstRow = sheet.getRow(1);
        if (!firstRow.cellCount) return;

        let keys = firstRow.values as any[];

        sheet.eachRow((row, rowNumber) => {
          if (rowNumber == 1) return;
          let values = row.values as any;
          let obj: any = {};
          for (let i = 1; i < keys.length; i++) {
            obj[keys[i]] = values[i];
          }

          const userData: IUserImportData = {
            key: rowNumber.toString(),
            fullName: obj.fullName || obj["Full Name"] || "",
            email: obj.email || obj["Email"] || "",
            phone: obj.phone || obj["Phone"] || "",
          };

          if (userData.fullName && userData.email) {
            jsonData.push(userData);
          }
        });
      });

      message.destroy();
      setPreviewData(jsonData);

      if (jsonData.length > 0) {
        message.success(`Parsed ${jsonData.length} users from Excel file!`);
      } else {
        message.warning(
          "No valid user data found in Excel file. Please check the format."
        );
      }
    } catch (error) {
      message.destroy();
      message.error("Failed to parse Excel file!");
      setPreviewData([]);
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  return (
    <Modal
      title="Import Users"
      open={openModalImport}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <div style={{ marginBottom: "24px" }}>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: "48px" }} />
          </p>
          <p
            className="ant-upload-text"
            style={{ fontSize: "16px", fontWeight: "bold" }}
          >
            Click or drag Excel file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for single Excel file upload only. File size limit: 10MB
            <br />
            Accepted formats: .xlsx, .xls
          </p>
        </Dragger>
      </div>

      {previewData.length > 0 && (
        <>
          <Divider />
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "16px" }}>
              Preview Data ({previewData.length} users)
            </h3>

            <Table
              rowKey="key"
              columns={columns}
              dataSource={previewData}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} users`,
              }}
              size="small"
            />
          </div>
        </>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          borderTop: "1px solid #f0f0f0",
          paddingTop: "16px",
        }}
      >
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          type="primary"
          onClick={handleImport}
          loading={isSubmitting}
          disabled={previewData.length === 0}
        >
          {isSubmitting
            ? "Importing..."
            : `Import Users (${previewData.length})`}
        </Button>
      </div>
    </Modal>
  );
};

export default ImportUser;
