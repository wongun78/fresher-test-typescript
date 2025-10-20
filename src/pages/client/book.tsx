import BookDetail from "@/components/client/book/book.detail";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookByIdAPI } from "@/services/api";
import { message, Spin, Button } from "antd";

const BookPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<IBookTable | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchBookDetail(id);
    }
  }, [id]);

  const fetchBookDetail = async (bookId: string) => {
    try {
      setLoading(true);
      const res = await getBookByIdAPI(bookId);
      if (res && res.data) {
        setBook(res.data);
        if (res.data.thumbnail) {
          setCurrentImage(
            `${import.meta.env.VITE_BACKEND_URL}/images/book/${
              res.data.thumbnail
            }`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching book:", error);
      message.error("Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (value: number | null) => {
    if (value && value > 0 && book && value <= book.quantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    message.success(`Added ${quantity} item(s) to cart`);
    // TODO: Implement cart logic
  };

  const handleBuyNow = () => {
    message.info("Redirecting to checkout...");
    navigate("/checkout");
    // TODO: Implement buy now logic
  };

  const allImages = book
    ? [
        `${import.meta.env.VITE_BACKEND_URL}/images/book/${book.thumbnail}`,
        ...(book.slider || []).map(
          (img) => `${import.meta.env.VITE_BACKEND_URL}/images/book/${img}`
        ),
      ]
    : [];

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Book not found
  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Book not found</h2>
          <Button type="primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <BookDetail
      book={book}
      quantity={quantity}
      currentImage={currentImage}
      allImages={allImages}
      isModalOpen={isModalOpen}
      onQuantityChange={handleQuantityChange}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
      onImageChange={setCurrentImage}
      onModalOpen={() => setIsModalOpen(true)}
      onModalClose={() => setIsModalOpen(false)}
    />
  );
};

export default BookPage;
