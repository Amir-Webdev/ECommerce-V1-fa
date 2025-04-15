import { useEffect, useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";
import { Form, Button, Col } from "react-bootstrap";
import { savePaymentMethod } from "../store/slices/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SEOMeta from "../components/SEOMeta.jsx";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("ZarinPal");
  const { shippingAddress } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!shippingAddress) navigate("/shipping");
  }, [shippingAddress, navigate]);

  async function submitHandler(e) {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  }

  return (
    <>
      {/* Updated SEO Meta for Persian */}
      <SEOMeta
        title="روش پرداخت | بارین مارکت"
        description="روش پرداخت مورد نظر خود را انتخاب کنید تا خریدتان را تکمیل نمایید"
        keywords="پرداخت, روش پرداخت, فروشگاه اینترنتی, بارین مارکت"
        canonical={window.location.href}
        openGraph={{
          title: "روش پرداخت | بارین مارکت",
          description:
            "روش پرداخت مورد نظر خود را انتخاب کنید تا خریدتان را تکمیل نمایید",
          url: window.location.href,
        }}
      />

      <FormContainer>
        <CheckoutSteps step={3} isRTL={true} /> {/* Added isRTL prop */}
        <h1 className="text-end">روش پرداخت</h1>
        <Form onSubmit={submitHandler} className="text-end">
          {" "}
          {/* RTL alignment */}
          <Form.Group>
            <Form.Label as="legend" className="d-block text-end mb-3">
              {" "}
              {/* RTL styling */}
              روش پرداخت را انتخاب کنید
            </Form.Label>
            <div className="text-end">
              {" "}
              {/* Right-aligned radio buttons */}
              <Form.Check
                type="radio"
                className="my-2"
                label="زرین‌پال"
                id="ZarinPal"
                name="paymentMethod"
                value="ZarinPal"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              {/* Add more payment methods if needed */}
            </div>
          </Form.Group>
          <Button type="submit" variant="primary" className="mt-3 w-100">
            {/* Full width button */}
            ادامه
          </Button>
        </Form>
      </FormContainer>
    </>
  );
}

export default Payment;
