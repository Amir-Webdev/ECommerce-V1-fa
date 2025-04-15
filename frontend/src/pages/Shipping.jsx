import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { saveShippingAddress } from "../store/slices/cart/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import SEOMeta from "../components/SEOMeta.jsx";

function Shipping() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [shippingAddressForm, setShippingAddressForm] = useState({
    address: shippingAddress?.address || "",
    city: shippingAddress?.city || "",
    postalCode: shippingAddress?.postalCode || "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleChange(e) {
    setShippingAddressForm({
      ...shippingAddressForm,
      [e.target.id]: e.target.value,
    });
  }

  async function submitHandler(e) {
    e.preventDefault();
    dispatch(saveShippingAddress(shippingAddressForm));
    navigate("/payment");
  }

  return (
    <>
      <SEOMeta
        title="اطلاعات ارسال | فروشگاه بارین"
        description="آدرس خود را وارد کنید تا سفارش شما تکمیل شود."
        keywords="ارسال, خرید آنلاین, فروشگاه بارین"
        canonical={window.location.href}
        openGraph={{
          title: "اطلاعات ارسال | فروشگاه بارین",
          description: "آدرس خود را وارد کنید تا سفارش شما تکمیل شود.",
          url: window.location.href,
        }}
      />

      <FormContainer>
        <CheckoutSteps step="2" />

        <h1 className="text-center my-3">اطلاعات ارسال</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="address" className="my-2 text-end">
            <Form.Label>آدرس:</Form.Label>
            <Form.Control
              type="text"
              placeholder="آدرس را وارد کنید"
              value={shippingAddressForm.address}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>

          <Form.Group controlId="city" className="my-2 text-end">
            <Form.Label>شهر:</Form.Label>
            <Form.Control
              type="text"
              placeholder="شهر را وارد کنید"
              value={shippingAddressForm.city}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>

          <Form.Group controlId="postalCode" className="my-2 text-end">
            <Form.Label>کد پستی:</Form.Label>
            <Form.Control
              type="text"
              placeholder="کد پستی را وارد کنید"
              value={shippingAddressForm.postalCode}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-2">
            ادامه
          </Button>
        </Form>
      </FormContainer>
    </>
  );
}

export default Shipping;
