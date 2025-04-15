import { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../store/slices/api/userApiSlice";
import { setCredentials } from "../store/slices/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import SEOMeta from "../components/SEOMeta.jsx";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (userInfo && redirect) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  async function submitHandler(e) {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      toast.error("رمزهای عبور مطابقت ندارند");
      return;
    }

    try {
      const res = await register(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }

  return (
    <>
      <SEOMeta
        title="ثبت‌نام | فروشگاه بارین"
        description="در فروشگاه بارین ثبت‌نام کنید و خرید خود را آغاز نمایید."
        keywords="ثبت‌نام، فروشگاه اینترنتی، بارین"
        canonical={window.location.href}
        openGraph={{
          title: "ثبت‌نام | فروشگاه بارین",
          description:
            "در فروشگاه بارین ثبت‌نام کنید و خرید خود را آغاز نمایید.",
          url: window.location.href,
        }}
      />

      <FormContainer>
        <h1 className="text-end">ثبت‌نام</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3 text-end">
            <Form.Label>نام:</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              placeholder="نام خود را وارد کنید"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group controlId="email" className="my-3 text-end">
            <Form.Label>ایمیل:</Form.Label>
            <Form.Control
              type="email"
              placeholder="ایمیل خود را وارد کنید"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group controlId="password" className="my-3 text-end">
            <Form.Label>رمز عبور:</Form.Label>
            <Form.Control
              type="password"
              placeholder="رمز عبور را وارد کنید"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="my-3 text-end">
            <Form.Label>تأیید رمز عبور:</Form.Label>
            <Form.Control
              type="password"
              placeholder="رمز عبور را دوباره وارد کنید"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="mt-2"
            disabled={isLoading}
          >
            ثبت‌نام
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row className="py-3 text-end">
          <Col>
            قبلاً حساب دارید؟{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              وارد شوید
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
}

export default Register;
