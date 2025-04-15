import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col, Card } from "react-bootstrap";
import { FaCheckCircle, FaHome, FaShoppingBag } from "react-icons/fa";
import Lottie from "lottie-react";
import SuccessfulPurchase from "../animation/SuccessfulPurchase.animation.json";
import { toast } from "react-toastify";
import { useGetOrderDetailsQuery } from "../store/slices/api/orderApiSlice";
import Loader from "../components/Loader";
import SEOMeta from "../components/SEOMeta.jsx";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrderDetailsQuery(orderId);

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {/* Persian SEO Meta */}
      <SEOMeta
        title="پرداخت موفق | بارین مارکت"
        description="پرداخت شما با موفقیت انجام شد. سفارش شما ثبت شده و در حال پردازش است."
        keywords="پرداخت موفق, فروشگاه اینترنتی, بارین مارکت"
        canonical={window.location.href}
        openGraph={{
          title: "پرداخت موفق | بارین مارکت",
          description:
            "پرداخت شما با موفقیت انجام شد. سفارش شما ثبت شده و در حال پردازش است.",
          url: window.location.href,
        }}
      />

      <Row className="my-5 py-5 justify-content-center" dir="rtl">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 text-center">
              {/* Success Animation */}
              <div className="mb-4" style={{ height: "150px" }}>
                <Lottie
                  animationData={SuccessfulPurchase}
                  loop={false}
                  style={{ height: "100%" }}
                />
              </div>

              <h2 className="fw-bold mb-3">پرداخت موفق!</h2>
              <p className="text-muted mb-4">
                با تشکر از خرید شما. سفارش شما ثبت شده و در حال پردازش است.
              </p>

              {/* Order Summary */}
              <Card className="mb-4 border-0 bg-light text-end">
                <Card.Body>
                  <h5 className="fw-bold mb-3">خلاصه سفارش</h5>
                  <Row className="mb-2">
                    <Col xs={6} className="text-end text-muted">
                      شماره سفارش:
                    </Col>
                    <Col xs={6} className="text-start fw-bold">
                      {orderId}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={6} className="text-end text-muted">
                      مبلغ پرداختی:
                    </Col>
                    <Col xs={6} className="text-start fw-bold">
                      {order.totalPrice.toLocaleString("fa-IR")} تومان
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={6} className="text-end text-muted">
                      تاریخ:
                    </Col>
                    <Col xs={6} className="text-start fw-bold">
                      {new Date(order.paidAt).toLocaleDateString("fa-IR")}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} className="text-end text-muted">
                      روش پرداخت:
                    </Col>
                    <Col xs={6} className="text-start fw-bold">
                      {order.paymentMethod === "ZarinPal"
                        ? "زرین‌پال"
                        : order.paymentMethod}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Action Buttons */}
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                <Button
                  variant="primary"
                  onClick={() => navigate("/")}
                  className="px-4 gap-3"
                >
                  <FaHome className="ms-2" /> {/* Changed me to ms for RTL */}
                  بازگشت به خانه
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate(`/order/${orderId}`)}
                  className="px-4"
                >
                  <FaShoppingBag className="ms-2" />{" "}
                  {/* Changed me to ms for RTL */}
                  مشاهده سفارش
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PaymentSuccess;
