import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Form,
  Image,
  ListGroup,
  Button,
  Card,
  ListGroupItem,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../store/slices/cart/cartSlice";
import Lottie from "lottie-react";
import emptyCartAnimation from "../animation/EmptyCart.animation.json";
import SEOMeta from "../components/SEOMeta";
import { formatNumber } from "../utils/toPersianDigits";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  function addToCartHandler(product, quantity) {
    dispatch(addToCart({ ...product, quantity }));
  }

  function removeFromCartHandler(productId) {
    dispatch(removeFromCart(productId));
  }

  function checkoutHandler() {
    navigate("/login?redirect=/shipping");
  }

  return (
    <>
      {/* Updated SEO Meta for Persian */}
      <SEOMeta
        title="سبد خرید | بارین مارکت"
        description="مدیریت سبد خرید و مشاهده محصولات انتخاب شده"
        keywords="سبد خرید, خرید اینترنتی, بارین مارکت"
        canonical={window.location.href}
        openGraph={{
          title: "سبد خرید | بارین مارکت",
          description: "مدیریت سبد خرید و مشاهده محصولات انتخاب شده",
          url: window.location.href,
        }}
      />

      <Row className="text-end">
        {" "}
        {/* Added RTL text alignment */}
        <Col md={8}>
          <h1 style={{ marginBottom: "20px" }}>سبد خرید</h1>
          {!cartItems.length ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <div style={{ width: "300px", margin: "0 auto" }}>
                <Lottie
                  animationData={emptyCartAnimation}
                  loop={true}
                  autoplay={true}
                />
              </div>
              <Message>
                سبد خرید شما خالی است <Link to="/">بازگشت به صفحه اصلی</Link>
              </Message>
            </div>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3} className="text-end">
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>{formatNumber(item.price)} تومان</Col>{" "}
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.quantity}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                        className="text-end"
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option value={x + 1} key={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={1}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item._id)}
                        className="me-2"
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroupItem className="text-end">
                <h2>
                  جمع کل (
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                  محصول
                </h2>
                {formatNumber(
                  cartItems.reduce(
                    (acc, item) => acc + item.quantity * item.price,
                    0
                  )
                )}
                <span style={{ marginRight: "4px" }}>تومان</span>
              </ListGroupItem>

              <ListGroup.Item className="text-end">
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  پرداخت نهایی
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Cart;
