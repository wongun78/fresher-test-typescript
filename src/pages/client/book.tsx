import BookDetail from "@/components/client/book/book.detail";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookByIdAPI } from "@/services/api";
import { message, Spin, Button } from "antd";
import { userCurrentApp } from "@/components/context/app.context";

const BookPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCarts } = userCurrentApp();

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
    if (!book) return;

    try {
      const cartStorage = localStorage.getItem("carts");
      let carts: ICart[] = [];

      if (cartStorage) {
        carts = JSON.parse(cartStorage) as ICart[];
        const existingCartIndex = carts.findIndex(
          (cart) => cart.detail._id === book._id
        );

        if (existingCartIndex > -1) {
          // Update quantity if book already exists in cart
          carts[existingCartIndex].quantity += quantity;
        } else {
          // Add new book to cart
          carts.push({
            _id: book._id,
            quantity: quantity,
            detail: book,
          });
        }
      } else {
        // Create new cart
        carts = [
          {
            _id: book._id,
            quantity: quantity,
            detail: book,
          },
        ];
      }

      // Save to localStorage
      localStorage.setItem("carts", JSON.stringify(carts));

      setCarts(carts);

      message.success(`Added ${quantity} item(s) to cart successfully`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Failed to add to cart");
    }
  };

  const handleBuyNow = () => {
    // Add to cart first
    handleAddToCart();

    // Then navigate to checkout
    setTimeout(() => {
      navigate("/checkout");
    }, 500);
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
        <Spin size="large" tip="Loading book details..." />
      </div>
    );
  }

  // Book not found
  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Book not found
          </h2>
          <p className="text-gray-500 mb-4">
            The book you're looking for doesn't exist or has been removed.
          </p>
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
