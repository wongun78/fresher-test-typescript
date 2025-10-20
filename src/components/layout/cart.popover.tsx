import { Badge, Button, Empty, Popover } from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface IProps {
  carts: ICart[];
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const CartPopover = (props: IProps) => {
  const { carts, onUpdateQuantity, onRemoveItem } = props;
  const navigate = useNavigate();

  const totalCartItems =
    carts?.reduce((total, cart) => total + cart.quantity, 0) ?? 0;

  const content = (
    <div className="w-[380px] max-h-[500px]">
      {carts.length === 0 ? (
        <div className="py-8">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Your cart is empty"
          />
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-3 mb-4 max-h-[350px] overflow-y-auto">
            {carts.map((cart) => (
              <div
                key={cart._id}
                className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Book Image */}
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    cart.detail.thumbnail
                  }`}
                  alt={cart.detail.mainText}
                  className="w-16 h-20 object-cover rounded flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/book/${cart.detail._id}`)}
                />

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-sm font-semibold line-clamp-2 mb-1 cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/book/${cart.detail._id}`)}
                  >
                    {cart.detail.mainText}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2 truncate">
                    {cart.detail.author}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-red-500">
                      {formatPrice(cart.detail.price)}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <Button
                        type="text"
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => {
                          if (cart.quantity > 1) {
                            onUpdateQuantity(cart._id, cart.quantity - 1);
                          }
                        }}
                        disabled={cart.quantity <= 1}
                        className="w-6 h-6 flex items-center justify-center p-0"
                      />
                      <span className="w-8 text-center text-sm font-semibold">
                        {cart.quantity}
                      </span>
                      <Button
                        type="text"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          if (cart.quantity < cart.detail.quantity) {
                            onUpdateQuantity(cart._id, cart.quantity + 1);
                          }
                        }}
                        disabled={cart.quantity >= cart.detail.quantity}
                        className="w-6 h-6 flex items-center justify-center p-0"
                      />
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onRemoveItem(cart._id)}
                        className="w-6 h-6 flex items-center justify-center p-0 ml-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button block onClick={() => navigate("/order")}>
            View Cart
          </Button>
        </>
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      title={
        <div className="flex items-center justify-between">
          <span className="font-semibold">Shopping Cart</span>
        </div>
      }
      trigger="hover"
      placement="bottomRight"
      overlayStyle={{ width: "auto" }}
    >
      <Button
        type="text"
        icon={
          <Badge count={totalCartItems} size="small" showZero>
            <ShoppingCartOutlined style={{ fontSize: "20px" }} />
          </Badge>
        }
      />
    </Popover>
  );
};

export default CartPopover;
