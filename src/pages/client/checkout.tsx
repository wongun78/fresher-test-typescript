import { userCurrentApp } from "@/components/context/app.context";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Steps,
  Form,
  Input,
  Divider,
  Empty,
  Radio,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createOrderAPI } from "@/services/api";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const CheckoutPage = () => {
  const { carts, user } = userCurrentApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName || "",
        phone: user.phone || "",
      });
    }
  }, [user, form]);

  const totalPrice = carts.reduce(
    (sum, cart) => sum + cart.detail.price * cart.quantity,
    0
  );

  const handleSubmitOrder = async (values: any) => {
    setIsSubmitting(true);

    try {
      const detail = carts.map((cart) => ({
        bookName: cart.detail.mainText,
        quantity: cart.quantity,
        _id: cart._id,
      }));

      const res = await createOrderAPI(
        values.fullName,
        values.address,
        values.phone,
        totalPrice,
        paymentMethod,
        detail
      );

      if (res && res.data) {
        message.success("Order placed successfully!");
        navigate("/payment", {
          state: {
            orderData: values,
            totalPrice,
            paymentMethod,
            orderId: res.data._id,
          },
        });
      } else {
        message.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
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
          onClick={() => navigate("/order")}
          className="mb-4"
        >
          Back to Cart
        </Button>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <Steps
          current={1}
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
        {/* Left Column - Order Items (Read-only) */}
        <div className="lg:col-span-2">
          <Card title="Order Items">
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
                      className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                    />

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                        {cart.detail.mainText}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Author: {cart.detail.author}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-red-500">
                          {formatPrice(cart.detail.price)}
                        </span>
                        <span className="text-sm text-gray-600">
                          Quantity: {cart.quantity}
                        </span>
                      </div>

                      {/* Subtotal */}
                      <div className="mt-2 pt-2 border-t">
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

                  {index < carts.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Shipping Info & Order Summary */}
        <div className="lg:col-span-1">
          <Card title="Shipping Information" className="sticky">
            <Form form={form} layout="vertical" onFinish={handleSubmitOrder}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input placeholder="John Doe" size="large" />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please enter your phone number",
                  },
                ]}
              >
                <Input placeholder="0123456789" size="large" />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
              >
                <Input.TextArea
                  placeholder="Street address, city, district..."
                  rows={3}
                  size="large"
                />
              </Form.Item>

              {/* Payment Method */}
              <Form.Item label="Payment Method">
                <Radio.Group
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  value={paymentMethod}
                  className="w-full"
                >
                  <div className="space-y-2">
                    <Radio value="COD" className="w-full">
                      Cash on Delivery (COD)
                    </Radio>
                    <Radio value="BANK" className="w-full">
                      Bank Transfer
                    </Radio>
                  </div>
                </Radio.Group>
              </Form.Item>

              <Divider className="my-4" />

              {/* Order Summary */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">Order Summary</h4>

                {/* Items Count */}
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Total items:</span>
                  <span className="font-semibold">
                    {carts.reduce((total, cart) => total + cart.quantity, 0)}
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Shipping:</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>

                <Divider className="my-3" />

                {/* Total */}
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-red-500 text-xl">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="mt-6"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing an order, you agree to our Terms & Conditions
              </p>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
