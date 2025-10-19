import {
  App,
  Form,
  Modal,
  Input,
  Button,
  InputNumber,
  Select,
  Upload,
  Image,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createBookAPI, getCategoryAPI, uploadFileAPI } from "@/services/api";
import { useState, useEffect } from "react";
import type { FormProps, UploadFile, UploadProps } from "antd";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";

type FileType = any;

type UserUploadType = "thumbnail" | "slider";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (open: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  mainText: string;
  author: string;
  price: number;
  category: string;
  quantity: number;
  sold?: number;
  thumbnail?: any;
  slider?: any;
};

const CreateBook = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [thumbnailFileList, setThumbnailFileList] = useState<UploadFile[]>([]);
  const [sliderFileList, setSliderFileList] = useState<UploadFile[]>([]);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategoryAPI();
      if (response && response.data) {
        const d = response.data.map((item) => ({
          label: item,
          value: item,
        }));
        setCategories(d);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    await handleSubmit(values);
  };

  const handleSubmit = async (values: FieldType) => {
    try {
      setIsSubmitting(true);

      const { mainText, author, price, category, quantity, sold = 0 } = values;
      const thumbnail = thumbnailFileList?.[0]?.name ?? "";
      const slider = sliderFileList?.map((item) => item.name) ?? [];

      const response = await createBookAPI(
        mainText,
        author,
        price,
        category,
        quantity,
        sold,
        thumbnail,
        slider
      );

      if (response && response?.data) {
        message.success("Book created successfully!");
        form.resetFields();
        setThumbnailFileList([]);
        setSliderFileList([]);
        setOpenModalCreate(false);
        refreshTable();
      } else {
        notification.error({
          message: "Creation Failed",
          description:
            response.message || "Failed to create book. Please try again!",
        });
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
    setThumbnailFileList([]);
    setSliderFileList([]);
    setOpenModalCreate(false);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  const handleRemove = async (file: UploadFile, type: UserUploadType) => {
    if (type === "thumbnail") {
      setThumbnailFileList([]);
    } else if (type === "slider") {
      const newSliderList = sliderFileList.filter(
        (item) => item.uid !== file.uid
      );
      setSliderFileList(newSliderList);
    }
  };

  const beforeUpload = (file: any) => {
    const isImage =
      (file as any).type === "image/jpeg" || (file as any).type === "image/png";
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    const isLtMax = (file as any).size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLtMax) {
      message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
    }
    return (isImage && isLtMax) || Upload.LIST_IGNORE;
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleChange = (info: any, type: UserUploadType) => {
    if (info.file.status === "uploading") {
      type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
      return;
    }
    if (info.file.status === "done") {
      type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
    }
  };

  const handleSliderChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setSliderFileList(newFileList);
  };

  const handleUploadFile = async (options: any, type: UserUploadType) => {
    const { onSuccess, onError } = options;
    const file = options.file as UploadFile;
    try {
      const res = await uploadFileAPI(file, "book");
      if (res && res.data) {
        const uploadedFile: any = {
          uid: file.uid,
          name: res.data.fileUploaded,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            res.data.fileUploaded
          }`,
        };
        if (type === "thumbnail") {
          setThumbnailFileList([{ ...uploadedFile }]);
        } else if (type === "slider") {
          setSliderFileList((prev) => [...prev, { ...uploadedFile }]);
        }
        if (onSuccess) {
          onSuccess("ok");
        }
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error("Upload failed");
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <Modal
      title="Create New Book"
      open={openModalCreate}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        name="createBook"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Main Text"
          name="mainText"
          rules={[
            { required: true, message: "Please input the main text!" },
            { min: 2, message: "Main text must be at least 2 characters!" },
            { max: 200, message: "Main text must not exceed 200 characters!" },
          ]}
        >
          <Input placeholder="Enter main text" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Author"
          name="author"
          rules={[
            { required: true, message: "Please input the author!" },
            { min: 2, message: "Author must be at least 2 characters!" },
          ]}
        >
          <Input placeholder="Enter author name" />
        </Form.Item>

        <Form.Item<FieldType>
          labelCol={{ span: 24 }}
          label="Giá tiền"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            // @ts-ignore - parser typing mismatch with antd version
            parser={(value) => value?.replace(/,/g, "")}
            addonAfter="đ"
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select
            placeholder="Select category"
            loading={categories.length === 0}
          >
            {categories.map((category) => (
              <Select.Option key={category.value} value={category.value}>
                {category.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item<FieldType>
          label="Quantity"
          name="quantity"
          rules={[
            { required: true, message: "Please input the quantity!" },
            { type: "number", min: 0, message: "Quantity must be positive!" },
          ]}
        >
          <InputNumber
            placeholder="Enter quantity"
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Sold"
          name="sold"
          initialValue={0}
          rules={[
            { type: "number", min: 0, message: "Sold must be positive!" },
          ]}
        >
          <InputNumber
            placeholder="Enter sold quantity"
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Thumbnail"
          name="thumbnail"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            customRequest={(options) => handleUploadFile(options, "thumbnail")}
            fileList={thumbnailFileList}
            onPreview={handlePreview}
            onChange={(info) => handleChange(info, "thumbnail")}
            onRemove={(file) => handleRemove(file, "thumbnail")}
            beforeUpload={beforeUpload}
          >
            {thumbnailFileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Slider Images"
          name="slider"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            maxCount={5}
            fileList={sliderFileList}
            onPreview={handlePreview}
            onChange={handleSliderChange}
            customRequest={(options) => handleUploadFile(options, "slider")}
            onRemove={(file) => handleRemove(file, "slider")}
            beforeUpload={beforeUpload}
          >
            {sliderFileList.length >= 8 ? null : uploadButton}
          </Upload>
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
            {isSubmitting ? "Creating Book..." : "Create Book"}
          </Button>
        </div>
      </Form>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Modal>
  );
};

export default CreateBook;
