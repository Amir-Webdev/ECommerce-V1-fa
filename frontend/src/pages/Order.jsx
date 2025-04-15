import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useUpdataOrderStatusMutation,
} from "../store/slices/api/orderApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SEOMeta from "../components/SEOMeta.jsx";
import { formatNumber } from "../utils/toPersianDigits.js";

function Order() {
  const [orderStatus, setOrderStatus] = useState();
  const { orderId } = useParams();
  const navigate = useNavigate();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation({});
  const [updateOrderStatus, { isLoading: loadingStatus }] =
    useUpdataOrderStatusMutation(orderId, orderStatus);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin && !isLoading) {
      setOrderStatus(order.status);
    }
  }, [userInfo, order, isLoading]);

  async function onApproveTest() {
    try {
      await payOrder({ orderId, details: { payer: {} } }).unwrap();
      refetch();
      navigate(`/payment-success/${orderId}`);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }

  async function updateStatusHandler(e) {
    try {
      setOrderStatus(e.target.value);
      await updateOrderStatus({ orderId, status: e.target.value });
      refetch();
      toast.success("وضعیت سفارش با موفقیت به‌روزرسانی شد");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message type="danger">
      {error?.data?.message || error.error || "خطا در بارگذاری جزئیات سفارش"}
    </Message>
  ) : (
    <>
      <SEOMeta
        title={`جزئیات سفارش | سفارش #${order._id} | بارین مارکت`}
        description={`مشاهده جزئیات سفارش #${order._id}. اطلاعات پرداخت، ارسال و محصولات را بررسی کنید.`}
        keywords="جزئیات سفارش, فروشگاه اینترنتی, بارین مارکت"
        canonical={window.location.href}
        openGraph={{
          title: `جزئیات سفارش | سفارش #${order._id} | بارین مارکت`,
          description: `مشاهده جزئیات سفارش #${order._id}. اطلاعات پرداخت، ارسال و محصولات را بررسی کنید.`,
          url: window.location.href,
        }}
      />

      <h1 className="text-end">سفارش {order._id}</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item className="text-end">
              <h2>اطلاعات ارسال</h2>
              <p>
                <strong>نام: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>ایمیل: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>آدرس: </strong>
                {order.shippingAddress.address}، {order.shippingAddress.city}
              </p>
              <p>
                <strong>وضعیت سفارش: </strong>
                {order.status === "Processing" ? "در حال پردازش" : "تحویل شده"}
              </p>
              {order.status === "Processing" ? (
                <Message>سفارش در حال پردازش است</Message>
              ) : (
                <Message type="success">
                  تحویل شده در تاریخ {order.deliveredAt}
                </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item className="text-end">
              <h2>روش پرداخت</h2>
              <p>
                <strong>روش: </strong>
                {order.paymentMethod === "PayPal"
                  ? "پی‌پال"
                  : order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message type="success">
                  پرداخت شده در تاریخ {order.paidAt}
                </Message>
              ) : (
                <Message type="danger">پرداخت نشده</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item className="text-end">
              <h2>محصولات سفارش</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row className="align-items-center">
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col className="text-end">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4} className="text-end">
                      {formatNumber(item.quantity)} × {formatNumber(item.price)}{" "}
                      تومان = {formatNumber(item.quantity * item.price)} تومان
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item className="text-end">
                <h2>خلاصه سفارش</h2>
              </ListGroup.Item>
              <ListGroup.Item className="text-end">
                <Row className="mb-3">
                  <Col>محصولات</Col>
                  <Col>{formatNumber(order.itemsPrice)} تومان</Col>
                </Row>
                <Row className="mb-3">
                  <Col>هزینه ارسال: </Col>
                  <Col>{formatNumber(order.shippingPrice)} تومان</Col>
                </Row>
                <Row className="mb-3">
                  <Col>مالیات: </Col>
                  <Col>{formatNumber(order.taxPrice)} تومان</Col>
                </Row>
                <Row className="mb-3">
                  <Col>جمع کل: </Col>
                  <Col>{formatNumber(order.totalPrice)} تومان</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item className="text-center">
                  {loadingPay && <Loader />}
                  <Button
                    onClick={onApproveTest}
                    style={{ marginBottom: "10px" }}
                  >
                    تست پرداخت
                  </Button>
                </ListGroup.Item>
              )}
              {loadingStatus && <Loader />}
              {userInfo && userInfo.isAdmin && order.isPaid && (
                <ListGroup.Item className="text-end">
                  <Row>
                    <Col>وضعیت سفارش: </Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={orderStatus}
                        onChange={updateStatusHandler}
                        className="text-end"
                      >
                        <option value={"Processing"}>در حال پردازش</option>
                        <option value={"Delivered"}>تحویل شده</option>
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Order;
