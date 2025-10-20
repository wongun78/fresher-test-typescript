import { Modal, Image } from "antd";
import { useState, useEffect } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  title: string;
  currentIndex: number;
}

const ModalBookGallery = (props: IProps) => {
  const { isOpen, onClose, images, title, currentIndex } = props;
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      title={title}
    >
      <div className="relative">
        <div className="flex justify-center items-center bg-gray-100 rounded-lg p-4">
          <Image
            src={images[activeIndex]}
            alt={`${title} ${activeIndex + 1}`}
            style={{ maxHeight: "500px", objectFit: "contain" }}
            preview={false}
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            >
              <LeftOutlined style={{ fontSize: "20px" }} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            >
              <RightOutlined style={{ fontSize: "20px" }} />
            </button>
          </>
        )}

        <div className="text-center mt-4 text-gray-600">
          {activeIndex + 1} / {images.length}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto justify-center">
            {images.map((img, index) => (
              <div
                key={index}
                className={`flex-shrink-0 cursor-pointer border-2 rounded ${
                  activeIndex === index ? "border-blue-500" : "border-gray-200"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={img}
                  alt={`${title} ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalBookGallery;
