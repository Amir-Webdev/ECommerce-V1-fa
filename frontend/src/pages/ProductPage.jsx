import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import Rating from "../components/Rating";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Spinner,
  Form,
} from "react-bootstrap";
import {
  useCreateReviewMutation,
  useGetProductByIdQuery,
} from "../store/slices/api/productApiSlice.js";
import { addToCart } from "../store/slices/cart/cartSlice.js";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SEOMeta from "../components/SEOMeta.jsx"; // Import SEOMeta
import { formatNumber } from "../utils/toPersianDigits.js";

function ProductPage() {
  const { id: productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({
    productId,
    comment: "",
    rating: 0,
  });

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: product,
    refetch,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId);

  const [
    createReview,
    { isLoading: isCreatingReview, error: errorCreateReview },
  ] = useCreateReviewMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function addToCartHandler() {
    dispatch(addToCart({ ...product, quantity }));
    navigate("/cart");
  }

  async function submitHandler(e) {
    e.preventDefault();

    try {
      await createReview(review).unwrap();
      toast.success("Review Created");
      refetch();
      setReview({
        productId,
        comment: "",
        rating: 0,
      });
    } catch (error) {
      toast.error(
        error.data?.message || error.error || "Error Creating Review"
      );
    }
  }

  return (
    <>
      <SEOMeta
        title={`${product?.name || "محصول"} | بارین شاپ`}
        description={
          product?.description || "جزئیات محصول را در بارین شاپ مشاهده کنید."
        }
        keywords={`${product?.name}, فروشگاه اینترنتی, بارین شاپ`}
        canonical={window.location.href}
        openGraph={{
          title: `${product?.name || "محصول"} | بارین شاپ`,
          description:
            product?.description || "جزئیات محصول را در بارین شاپ مشاهده کنید.",
          url: window.location.href,
        }}
      />

      <Link to="/" className="btn btn-light my-3">
        بازگشت
      </Link>
      {isLoading ? (
        <div className="text-center">
          <Loader />
          <p>در حال بارگذاری محصول...</p>
        </div>
      ) : error ? (
        <Message type="danger">{error?.data?.message || error?.error}</Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            <Col md={4}>
              <ListGroup variant="flush" className="text-end">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} نظر`}
                  />
                </ListGroup.Item>

                <ListGroup.Item>
                  قیمت: {formatNumber(product.price)} تومان
                </ListGroup.Item>

                <ListGroup.Item>توضیحات: {product.description}</ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush" className="text-end">
                  <ListGroup.Item>
                    <Row>
                      <Col>قیمت:</Col>
                      <Col>
                        <strong>{formatNumber(product.price)} تومان</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>وضعیت:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0 ? "موجود" : "ناموجود"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>تعداد</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Number(e.target.value))
                            }
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option value={x + 1} key={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn-block w-100"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      افزودن به سبد خرید
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className="review mt-5">
            <Col md={6} className="text-end">
              <h2>نظرات کاربران</h2>
              {product.reviews.length === 0 && (
                <Message>نظری ثبت نشده است</Message>
              )}
              <ListGroup variant="flush" className="text-end">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h2>ثبت نظر جدید</h2>

                  {isCreatingReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating" className="my-2 text-end">
                        <Form.Label>امتیاز</Form.Label>
                        <Form.Control
                          as="select"
                          value={review.rating}
                          onChange={(e) =>
                            setReview({ ...review, rating: e.target.value })
                          }
                        >
                          <option value="">انتخاب...</option>
                          <option value="1">۱ - ضعیف</option>
                          <option value="2">۲ - متوسط</option>
                          <option value="3">۳ - خوب</option>
                          <option value="4">۴ - خیلی خوب</option>
                          <option value="5">۵ - عالی</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="comment" className="my-2 text-end">
                        <Form.Label>نظر شما</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows="3"
                          value={review.comment}
                          onChange={(e) =>
                            setReview({ ...review, comment: e.target.value })
                          }
                        />
                      </Form.Group>

                      <Button
                        disabled={isCreatingReview}
                        type="submit"
                        variant="primary"
                      >
                        ارسال نظر
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      لطفاً <Link to="/login">وارد شوید</Link> تا بتوانید نظر
                      ثبت کنید.
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default ProductPage;
