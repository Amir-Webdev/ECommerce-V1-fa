import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { useCreateOrderMutation } from "../store/slices/api/orderApiSlice";
import { clearCartItems } from "../store/slices/cart/cartSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import SEOMeta from "../components/SEOMeta.jsx";
import { formatNumber } from "../utils/toPersianDigits.js";

function PlaceOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) navigate("/shipping");
    else if (!cart.paymentMethod) navigate("/payment");
  }, [cart, navigate]);

  async function placeOrderHandler() {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <>
      {/* Persian SEO Meta */}
      <SEOMeta
        title="تکمیل سفارش | بارین مارکت"
        description="جزئیات سفارش خود را بررسی و خریدتان را نهایی کنید"
        keywords="تکمیل سفارش, فروشگاه اینترنتی, بارین مارکت"
        canonical={window.location.href}
        openGraph={{
          title: "تکمیل سفارش | بارین مارکت",
          description: "جزئیات سفارش خود را بررسی و خریدتان را نهایی کنید",
          url: window.location.href,
        }}
      />

      <CheckoutSteps step="4" isRTL={true} />

      <Row dir="rtl">
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item className="text-end">
              <h2>اطلاعات ارسال</h2>
              <p>
                <strong>آدرس: </strong>
                {cart.shippingAddress.address}، {cart.shippingAddress.city}،{" "}
                {cart.shippingAddress.postalCode}
              </p>
            </ListGroup.Item>

            <ListGroup.Item className="text-end">
              <h2>روش پرداخت</h2>
              <p>
                <strong>روش: </strong>
                {cart.paymentMethod === "ZarinPal"
                  ? "زرین‌پال"
                  : cart.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item className="text-end">
              <h2>محصولات سفارش</h2>

              {cart.cartItems.length === 0 ? (
                <Message>سبد خرید شما خالی است</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className="align-items-center">
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col className="text-end">
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>

                        <Col md={4} className="text-end">
                          {item.quantity} × {item.price.toLocaleString("fa-IR")}{" "}
                          تومان ={" "}
                          {(item.quantity * item.price).toLocaleString("fa-IR")}{" "}
                          تومان
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4} className="mt-3">
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item className="text-end">
                <h2>خلاصه سفارش</h2>
              </ListGroup.Item>

              <ListGroup.Item className="text-end">
                <Row>
                  <Col>محصولات: </Col>
                  <Col className="text-start">
                    {formatNumber(cart.itemsPrice)} تومان
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="text-end">
                <Row>
                  <Col>هزینه ارسال: </Col>
                  <Col className="text-start">
                    {formatNumber(cart.shippingPrice)} تومان
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="text-end">
                <Row>
                  <Col>مالیات: </Col>
                  <Col className="text-start">
                    {formatNumber(cart.taxPrice)} تومان
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="text-end">
                <Row>
                  <Col>جمع کل: </Col>
                  <Col className="text-start">
                    {formatNumber(cart.totalPrice)} تومان
                  </Col>
                </Row>
              </ListGroup.Item>

              {error && (
                <ListGroup.Item>
                  <Message type="danger">
                    {error.data?.message || error.error || "خطا در ثبت سفارش"}
                  </Message>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                >
                  {isLoading ? "در حال ثبت سفارش..." : "تکمیل سفارش"}
                </Button>

                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default PlaceOrder;
