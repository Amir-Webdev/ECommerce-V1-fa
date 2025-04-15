import { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../store/slices/api/userApiSlice";
import { setCredentials } from "../store/slices/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import SEOMeta from "../components/SEOMeta.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();

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

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }

  return (
    <>
      {/* Updated SEO Meta for Persian */}
      <SEOMeta
        title="ورود به حساب | بارین مارکت"
        description="برای دسترسی به حساب کاربری و خرید محصولات وارد شوید"
        keywords="ورود, حساب کاربری, فروشگاه اینترنتی, بارین مارکت"
        canonical={window.location.href}
        openGraph={{
          title: "ورود به حساب | بارین مارکت",
          description: "برای دسترسی به حساب کاربری و خرید محصولات وارد شوید",
          url: window.location.href,
        }}
      />

      <FormContainer>
        <h1 className="text-end">ورود به حساب</h1>

        <Form onSubmit={submitHandler} disabled={isLoading}>
          <Form.Group controlId="email" className="my-3 text-end">
            {" "}
            {/* RTL text alignment */}
            <Form.Label>ایمیل:</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              placeholder="ایمیل خود را وارد کنید"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-end"
            />{" "}
            {/* RTL input text */}
          </Form.Group>

          <Form.Group controlId="password" className="my-3 text-end">
            {" "}
            {/* RTL text alignment */}
            <Form.Label>رمز عبور:</Form.Label>
            <Form.Control
              type="password"
              placeholder="رمز عبور خود را وارد کنید"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-end"
            />{" "}
            {/* RTL input text */}
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="mt-2 w-100"
            disabled={isLoading}
          >
            {isLoading ? "در حال ورود..." : "ورود"}
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row className="py-3 text-center">
          <Col>
            کاربر جدید هستید؟
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="me-1"
            >
              ثبت نام کنید
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
}

export default Login;
