import { useEffect } from "react";
import { Button, Card, Result, Steps } from "antd";
import {
  ShoppingCartOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { userCurrentApp } from "@/components/context/app.context";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCarts } = userCurrentApp();

  const orderData = location.state?.orderData;
  const totalPrice = location.state?.totalPrice;
  const paymentMethod = location.state?.paymentMethod;
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (orderData) {
      setCarts?.([]);
      localStorage.removeItem("carts");
    }
  }, [orderData, setCarts]);

  if (!orderData) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Steps */}
      <div className="mb-8">
        <Steps
          current={2}
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

      {/* Success Message */}
      <Card>
        <Result
          status="success"
          title="Order Placed Successfully!"
          subTitle={
            <div className="space-y-1">
              <p>Your order has been confirmed.</p>
              <p className="text-gray-600">
                We will contact you shortly at{" "}
                <span className="font-semibold">{orderData.phone}</span>
              </p>
            </div>
          }
          extra={[
            <div key="actions" className="flex gap-3 justify-center">
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>,
          ]}
        />
      </Card>
    </div>
  );
};

export default PaymentPage;
