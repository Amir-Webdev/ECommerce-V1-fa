import { Table, Form, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useUpdateProfileMutation } from "../store/slices/api/userApiSlice";
import { setCredentials } from "../store/slices/auth/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useGetMyOrdersQuery } from "../store/slices/api/orderApiSlice";
import { FaTimes } from "react-icons/fa";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";
import SEOMeta from "../components/SEOMeta.jsx";

function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useUpdateProfileMutation(formData);

  const {
    data: orders,
    isLoading: loadingOrders,
    error: getMyOrdersError,
  } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setFormData({ ...formData, name: userInfo.name, email: userInfo.email });
    }
  }, [userInfo]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      toast.error("رمز عبور با تکرار آن مطابقت ندارد");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          ...formData,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("پروفایل با موفقیت بروزرسانی شد");
      } catch (error) {
        toast.error(error?.data?.message || error?.message);
      }
    }
  }

  return (
    <>
      <SEOMeta
        title="پروفایل من | فروشگاه بارین"
        description="اطلاعات پروفایل خود را مشاهده و ویرایش کنید. تاریخچه سفارش‌های خود را بررسی کنید."
        keywords="پروفایل کاربر، فروشگاه، بارین"
        canonical={window.location.href}
        openGraph={{
          title: "پروفایل من | فروشگاه بارین",
          description:
            "اطلاعات پروفایل خود را مشاهده و ویرایش کنید. تاریخچه سفارش‌های خود را بررسی کنید.",
          url: window.location.href,
        }}
      />

      <Row>
        <Col md={3}>
          <h2 className="text-end">پروفایل کاربر</h2>

          <Form onSubmit={handleSubmit} className="text-end">
            <Form.Group controlId="name" className="my-2">
              <Form.Label>نام:</Form.Label>
              <Form.Control
                type="text"
                placeholder="نام خود را وارد کنید"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="email" className="my-2">
              <Form.Label>ایمیل:</Form.Label>
              <Form.Control
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="password" className="my-2">
              <Form.Label>رمز عبور:</Form.Label>
              <Form.Control
                type="password"
                placeholder="رمز عبور جدید را وارد کنید"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="my-2">
              <Form.Label>تکرار رمز عبور:</Form.Label>
              <Form.Control
                type="password"
                placeholder="رمز عبور را دوباره وارد کنید"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2 w-100">
              بروزرسانی
            </Button>

            {loadingUpdateProfile && <Loader />}
          </Form>
        </Col>

        <Col md={9}>
          <h2 className="text-end">سفارش‌های من</h2>

          {loadingOrders ? (
            <Loader />
          ) : getMyOrdersError ? (
            <Message type="danger">
              {getMyOrdersError?.data?.message || getMyOrdersError?.message}
            </Message>
          ) : (
            <Table striped hover responsive className="table-sm text-end">
              <thead>
                <tr>
                  <th>کد سفارش</th>
                  <th>تاریخ</th>
                  <th>مبلغ کل</th>
                  <th>پرداخت شده</th>
                  <th>وضعیت</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>{order.status || "در حال پردازش"}</td>
                    <td>
                      <Button
                        className="btn-sm"
                        variant="light"
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        جزئیات
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
}

export default Profile;
