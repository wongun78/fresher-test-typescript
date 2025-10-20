import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Pagination,
  Row,
  Col,
  Typography,
  Tag,
  Divider,
  Spin,
  Checkbox,
  InputNumber,
  Select,
  Form,
  type FormProps,
  Empty,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { getBooksAPI, getCategoryAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const HomePage = () => {
  type FieldType = {
    range?: {
      from?: number;
      to?: number;
    };
    category?: string[];
  };

  const navigate = useNavigate();
  const [form] = Form.useForm<FieldType>();
  const [listCategory, setListCategory] = useState<
    { label: string; value: string }[]
  >([]);

  const [listBook, setListBook] = useState<IBookTable[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [sortQuery, setSortQuery] = useState<string>("sort=-sold");

  useEffect(() => {
    const initCategory = async () => {
      const res = await getCategoryAPI();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item, value: item };
        });
        setListCategory(d);
      }
    };
    initCategory();
  }, []);

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filter, sortQuery]);

  const fetchBook = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await getBooksAPI(query);
    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const handleOnchangePage = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    let filterStr = "";
    const filters: string[] = [];

    // Xử lý filter category
    if (values?.category && values.category.length > 0) {
      filters.push(`category=${values.category.join(",")}`);
    }

    // Xử lý filter price range
    if (values?.range?.from !== undefined && values?.range?.from >= 0) {
      filters.push(`price>=${values.range.from}`);
    }
    if (values?.range?.to !== undefined && values?.range?.to >= 0) {
      filters.push(`price<=${values.range.to}`);
    }

    filterStr = filters.join("&");
    setFilter(filterStr);
    setCurrent(1); // Reset về trang đầu khi filter
  };

  const handleResetFilter = () => {
    form.resetFields();
    setFilter("");
    setCurrent(1);
  };

  const handleSortChange = (value: string) => {
    setSortQuery(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-4">
        <Row gutter={[16, 16]} className="min-h-screen">
          {/* Left Sidebar - Filters */}
          <Col xs={24} lg={4} className="h-screen">
            <div className="sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto">
              <Card
                className="h-full"
                bodyStyle={{ height: "calc(100% - 57px)", overflow: "auto" }}
              >
                <Title level={5} className="mb-0">
                  Filters
                </Title>
                <Divider />

                <Form
                  form={form}
                  name="filterForm"
                  onFinish={onFinish}
                  layout="vertical"
                  autoComplete="off"
                >
                  {/* Category Filter */}
                  <Form.Item
                    label={
                      <Title level={5} className="mb-0">
                        Categories
                      </Title>
                    }
                    name="category"
                  >
                    <Checkbox.Group className="flex flex-col gap-2">
                      {listCategory.map((category) => (
                        <Checkbox
                          key={category.value}
                          value={category.value}
                          className="text-sm"
                        >
                          {category.label}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>

                  <Divider />

                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <Title level={5}>Price Range</Title>
                    <div className="space-y-2">
                      <Form.Item name={["range", "from"]} className="mb-2">
                        <InputNumber
                          placeholder="Min price"
                          size="small"
                          style={{ width: "100%" }}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value?.replace(/,/g, "") as any}
                          addonAfter="đ"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item name={["range", "to"]} className="mb-2">
                        <InputNumber
                          placeholder="Max price"
                          size="small"
                          style={{ width: "100%" }}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value?.replace(/,/g, "") as any}
                          addonAfter="đ"
                          min={0}
                        />
                      </Form.Item>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          type="primary"
                          size="small"
                          htmlType="submit"
                          className="flex-1"
                        >
                          Apply Filter
                        </Button>
                        <Button
                          size="small"
                          onClick={handleResetFilter}
                          className="flex-1"
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Divider />
                </Form>
              </Card>
            </div>
          </Col>

          {/* Right Content - Books */}
          <Col xs={24} lg={20}>
            {/* Sort Header */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Title level={4} className="!mb-0">
                All Books
                {total > 0 && (
                  <Text type="secondary" className="ml-2 text-sm font-normal">
                    ({total} results)
                  </Text>
                )}
              </Title>
              <div className="flex items-center gap-2">
                <Text>Sort by:</Text>
                <Select
                  defaultValue="sort=-sold"
                  value={sortQuery}
                  onChange={handleSortChange}
                  style={{ minWidth: 150 }}
                >
                  <Option value="sort=-sold">Popular</Option>
                  <Option value="sort=-createdAt">Newest</Option>
                  <Option value="sort=price">Price: Low to High</Option>
                  <Option value="sort=-price">Price: High to Low</Option>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-20">
                <Spin size="large" tip="Loading books..." />
              </div>
            ) : (
              <>
                {/* Empty State */}
                {listBook.length === 0 ? (
                  <div className="text-center py-20">
                    <Empty
                      description={
                        <div>
                          <p className="text-lg font-semibold mb-2">
                            No books found
                          </p>
                          <p className="text-gray-500 mb-4">
                            Try adjusting your filters or search term
                          </p>
                          <Button type="primary" onClick={handleResetFilter}>
                            Clear Filters
                          </Button>
                        </div>
                      }
                    />
                  </div>
                ) : (
                  <>
                    {/* Books Grid */}
                    <Row gutter={[12, 12]}>
                      {listBook.map((book) => (
                        <Col xs={12} sm={8} md={6} lg={4} key={book._id}>
                          <Card
                            hoverable
                            size="small"
                            className="h-full"
                            onClick={() => navigate(`/book/${book._id}`)}
                            cover={
                              <div className="relative">
                                <img
                                  alt={book.mainText}
                                  src={`${
                                    import.meta.env.VITE_BACKEND_URL
                                  }/images/book/${book.thumbnail}`}
                                  className="w-full h-40 object-cover"
                                />
                                <div className="absolute top-1 right-1">
                                  <Tag color="green" className="text-xs px-1">
                                    Sold: {book.sold}
                                  </Tag>
                                </div>
                              </div>
                            }
                            bodyStyle={{ padding: "8px" }}
                          >
                            <div className="space-y-1">
                              <div className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
                                {book.mainText}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {book.author}
                              </div>
                              <Tag color="blue" className="text-xs">
                                {book.category}
                              </Tag>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-bold text-red-500 text-sm">
                                    {formatPrice(book.price)}
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                Quantity: {book.quantity}
                              </div>
                              <Button
                                type="primary"
                                size="small"
                                block
                                icon={<ShoppingCartOutlined />}
                                className="mt-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/book/${book._id}`);
                                }}
                              >
                                Buy Now
                              </Button>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>

                    {/* Pagination */}
                    <Row
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "24px",
                      }}
                    >
                      <Pagination
                        current={current}
                        total={total}
                        pageSize={pageSize}
                        responsive
                        showSizeChanger
                        showTotal={(total) => `Total ${total} books`}
                        onChange={(p, s) =>
                          handleOnchangePage({ current: p, pageSize: s })
                        }
                      />
                    </Row>
                  </>
                )}
              </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
