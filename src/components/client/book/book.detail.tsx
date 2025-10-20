import { Row, Col, Image, Button, InputNumber, Tag, Divider, Rate } from "antd";
import {
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ModalBookGallery from "./modal.gallery";

interface IProps {
  book: IBookTable;
  quantity: number;
  currentImage: string;
  allImages: string[];
  isModalOpen: boolean;
  onQuantityChange: (value: number | null) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onImageChange: (image: string) => void;
  onModalOpen: () => void;
  onModalClose: () => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const BookDetail = (props: IProps) => {
  const {
    book,
    quantity,
    currentImage,
    allImages,
    isModalOpen,
    onQuantityChange,
    onAddToCart,
    onBuyNow,
    onImageChange,
    onModalOpen,
    onModalClose,
  } = props;

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Row gutter={[24, 24]}>
          {/* Left: Image Gallery */}
          <Col xs={24} md={10}>
            <div className="bg-white p-4 rounded-lg">
              {/* Main Image */}
              <div className="mb-4">
                <Image
                  src={currentImage}
                  alt={book.mainText}
                  className="w-full rounded-lg cursor-pointer"
                  preview={false}
                  onClick={onModalOpen}
                  style={{ maxHeight: "450px", objectFit: "contain" }}
                />
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {allImages.map((img, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 cursor-pointer border-2 rounded ${
                        currentImage === img
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                      onClick={() => onImageChange(img)}
                    >
                      <img
                        src={img}
                        alt={`${book.mainText} ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* Right: Book Info */}
          <Col xs={24} md={14}>
            <div className="bg-white p-6 rounded-lg">
              {/* Book Title */}
              <h1 className="text-2xl font-bold mb-2">{book.mainText}</h1>

              {/* Rating & Sold */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Rate disabled defaultValue={5} style={{ fontSize: 16 }} />
                  <span className="text-gray-600">(5.0)</span>
                </div>
                <Divider type="vertical" />
                <span className="text-gray-600">
                  <strong>{book.sold}</strong> Sold
                </span>
              </div>

              {/* Price */}
              <div className="bg-gray-50 p-4 rounded mb-4">
                <div className="text-3xl font-bold text-red-500">
                  {formatPrice(book.price)}
                </div>
              </div>

              {/* Author */}
              <div className="mb-4">
                <span className="text-gray-600">Author: </span>
                <span className="font-semibold">{book.author}</span>
              </div>

              <Divider />

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() => {
                        if (quantity > 1) {
                          onQuantityChange(quantity - 1);
                        }
                      }}
                      disabled={quantity <= 1}
                    />
                    <InputNumber
                      min={1}
                      max={book.quantity}
                      value={quantity}
                      onChange={onQuantityChange}
                      style={{ width: 80 }}
                    />
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => {
                        if (quantity < book.quantity) {
                          onQuantityChange(quantity + 1);
                        }
                      }}
                      disabled={quantity >= book.quantity}
                    />
                  </div>
                  <span className="text-gray-500">
                    {book.quantity} pieces available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={onAddToCart}
                  disabled={book.quantity === 0}
                  className="flex-1"
                >
                  Add to Cart
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={onBuyNow}
                  disabled={book.quantity === 0}
                  className="flex-1"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white p-6 rounded-lg mt-4">
              <h3 className="text-lg font-bold mb-4">Book Description</h3>
              <p className="text-gray-600 leading-relaxed">
                This is a detailed description of the book. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </Col>
        </Row>
      </div>

      {/* Image Gallery Modal */}
      <ModalBookGallery
        isOpen={isModalOpen}
        onClose={onModalClose}
        images={allImages}
        title={book.mainText}
        currentIndex={allImages.indexOf(currentImage)}
      />
    </div>
  );
};

export default BookDetail;
