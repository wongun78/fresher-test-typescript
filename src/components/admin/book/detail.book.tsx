import { useState, useEffect } from "react";
import {
  Drawer,
  Tag,
  Descriptions,
  Space,
  Button,
  Divider,
  Image,
  Upload,
} from "antd";
import { EditOutlined, PictureOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IBookTable | null;
  setDataViewDetail: (v: IBookTable | null) => void;
}

const DetailBook = (props: IProps) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [thumbnailFileList, setThumbnailFileList] = useState<UploadFile[]>([]);
  const [sliderFileList, setSliderFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (dataViewDetail) {
      if (dataViewDetail.thumbnail) {
        const thumbnailFile: UploadFile = {
          uid: "thumbnail-1",
          name: dataViewDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataViewDetail.thumbnail
          }`,
        };
        setThumbnailFileList([thumbnailFile]);
      } else {
        setThumbnailFileList([]);
      }

      if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
        const sliderFiles: UploadFile[] = dataViewDetail.slider.map(
          (item, index) => ({
            uid: `slider-${index}`,
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          })
        );
        setSliderFileList(sliderFiles);
      } else {
        setSliderFileList([]);
      }
    } else {
      setThumbnailFileList([]);
      setSliderFileList([]);
    }
  }, [dataViewDetail]);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || "");
    setPreviewOpen(true);
  };

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  return (
    <Drawer
      width={720}
      onClose={onClose}
      open={openViewDetail}
      extra={
        <Space>
          <Button icon={<EditOutlined />} type="primary">
            Edit Book
          </Button>
        </Space>
      }
    >
      {dataViewDetail && (
        <div>
          <Descriptions
            title="Book Details"
            bordered
            column={2}
            size="middle"
            style={{ marginBottom: "24px" }}
          >
            <Descriptions.Item label="Book ID" span={2}>
              <span style={{ fontFamily: "monospace" }}>
                {dataViewDetail._id}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Main Text">
              {dataViewDetail.mainText}
            </Descriptions.Item>

            <Descriptions.Item label="Author">
              {dataViewDetail.author}
            </Descriptions.Item>

            <Descriptions.Item label="Price">
              <span style={{ color: "#1890ff", fontWeight: "bold" }}>
                ${dataViewDetail.price.toLocaleString()}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Category">
              <Tag color="blue">{dataViewDetail.category}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Quantity">
              <span
                style={{
                  color: dataViewDetail.quantity > 0 ? "#52c41a" : "#ff4d4f",
                  fontWeight: "bold",
                }}
              >
                {dataViewDetail.quantity.toLocaleString()}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Sold">
              <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                {dataViewDetail.sold.toLocaleString()}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Created Date">
              {new Date(dataViewDetail.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Descriptions.Item>

            <Descriptions.Item label="Updated Date">
              {new Date(dataViewDetail.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              <PictureOutlined style={{ marginRight: "8px" }} />
              Book Images
            </h3>

            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}
              >
                Thumbnail:
              </h4>
              <Upload
                listType="picture-card"
                fileList={thumbnailFileList}
                onPreview={handlePreview}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: false,
                  showDownloadIcon: false,
                }}
                disabled
              />
            </div>

            {sliderFileList.length > 0 && (
              <div>
                <h4
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "12px",
                  }}
                >
                  Slider Images ({sliderFileList.length}):
                </h4>
                <Upload
                  listType="picture-card"
                  fileList={sliderFileList}
                  onPreview={handlePreview}
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: false,
                    showDownloadIcon: false,
                  }}
                  disabled
                />
              </div>
            )}
          </div>
        </div>
      )}

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
    </Drawer>
  );
};

export default DetailBook;
