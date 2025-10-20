import { userCurrentApp } from "@/components/context/app.context";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Empty,
  InputNumber,
  message,
  Divider,
  Space,
  Popconfirm,
  Steps,
} from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const OrderDetail = () => {
  const { carts, setCarts } = userCurrentApp();
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.forEach((item) => {
        sum += item.detail.price * item.quantity;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const handleUpdateQuantity = (bookId: string, quantity: number) => {
    if (!quantity || quantity < 1) {
      message.error("Quantity must be greater than 0");
      return;
    }

    const updatedCarts = carts.map((cart) => {
      if (cart._id === bookId) {
        // Check if quantity exceeds stock
        if (quantity > cart.detail.quantity) {
          message.error(`Only ${cart.detail.quantity} items left in stock`);
          return cart;
        }
        return { ...cart, quantity };
      }
      return cart;
    });

    setCarts?.(updatedCarts);
    localStorage.setItem("carts", JSON.stringify(updatedCarts));
    message.success("Quantity updated successfully");
  };

  const handleRemoveItem = (bookId: string) => {
    const updatedCarts = carts.filter((cart) => cart._id !== bookId);
    setCarts?.(updatedCarts);
    localStorage.setItem("carts", JSON.stringify(updatedCarts));
    message.success("Item removed from cart");
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (carts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card>
          <div className="text-center py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <p className="text-lg mb-4">Your cart is empty</p>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </Button>
                </div>
              }
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
          className="mb-4"
        >
          Back to Home
        </Button>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <Steps
          current={0}
          items={[
            {
              title: "Shopping Cart",
              icon: <ShoppingCartOutlined />,
            },
            {
              title: "Checkout",
              icon: <SolutionOutlined />,
            },
            {
              title: "Payment",
              icon: <CheckCircleOutlined />,
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <div className="space-y-4">
              {carts.map((cart, index) => (
                <div key={cart._id}>
                  <div className="flex gap-4">
                    {/* Book Image */}
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        cart.detail.thumbnail
                      }`}
                      alt={cart.detail.mainText}
                      className="w-24 h-32 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/book/${cart.detail._id}`)}
                    />

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-semibold mb-1 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => navigate(`/book/${cart.detail._id}`)}
                      >
                        {cart.detail.mainText}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Author: {cart.detail.author}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        In stock: {cart.detail.quantity}{" "}
                        {cart.detail.quantity === 1 ? "item" : "items"}
                      </p>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-red-500">
                            {formatPrice(cart.detail.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Quantity Control */}
                          <Space>
                            <span className="text-sm text-gray-600">
                              Quantity:
                            </span>
                            <InputNumber
                              min={1}
                              max={cart.detail.quantity}
                              value={cart.quantity}
                              onChange={(value) =>
                                handleUpdateQuantity(cart._id, value || 1)
                              }
                              className="w-24"
                            />
                          </Space>

                          {/* Remove Button */}
                          <Popconfirm
                            title="Remove item"
                            description="Are you sure you want to remove this item from your cart?"
                            onConfirm={() => handleRemoveItem(cart._id)}
                            okText="Remove"
                            cancelText="Cancel"
                          >
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                            ></Button>
                          </Popconfirm>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Subtotal:
                          </span>
                          <span className="text-lg font-semibold text-gray-900">
                            {formatPrice(cart.detail.price * cart.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider between items */}
                  {index < carts.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card title="Order Summary" className="sticky top-4">
            <div className="space-y-4">
              {/* Items Count */}
              <div className="flex justify-between text-gray-600">
                <span>Total items:</span>
                <span className="font-semibold">
                  {carts.reduce((total, cart) => total + cart.quantity, 0)}
                </span>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatPrice(totalPrice)}</span>
              </div>

              <Divider className="my-4" />

              {/* Total */}
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-red-500 text-xl">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                type="primary"
                size="large"
                block
                onClick={handleCheckout}
                className="mt-6"
              >
                Proceed to Checkout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
