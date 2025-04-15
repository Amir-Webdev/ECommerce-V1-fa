import { useGetOrdersQuery } from "../../store/slices/api/orderApiSlice";
import { FaTimes } from "react-icons/fa";
import { Table, Button } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useNavigate } from "react-router-dom";
import SEOMeta from "../../components/SEOMeta.jsx";

function OrderList() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  const navigate = useNavigate();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message type="danger">
      {error.data?.message || error.error || "خطا در بارگذاری سفارش‌ها"}
    </Message>
  ) : (
    <>
      <SEOMeta
        title="لیست سفارش‌ها | مدیریت | فروشگاه بارین"
        description="مشاهده و مدیریت تمامی سفارش‌های کاربران در پنل مدیریت فروشگاه بارین."
        keywords="سفارش, لیست سفارش‌ها, مدیریت, فروشگاه اینترنتی, بارین"
        canonical={window.location.href}
        openGraph={{
          title: "لیست سفارش‌ها | مدیریت | فروشگاه بارین",
          description:
            "مشاهده و مدیریت تمامی سفارش‌های کاربران در پنل مدیریت فروشگاه بارین.",
          url: window.location.href,
        }}
      />

      <h1 className="text-center my-3">سفارش‌ها</h1>

      <Table striped hover responsive className="table-sm text-end">
        <thead>
          <tr>
            <th>شناسه</th>
            <th>کاربر</th>
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
              <td>{order.user && order.user.name}</td>
              <td>{order.createdAt.substring(0, 10)}</td>
              <td>{order.totalPrice.toLocaleString("fa-IR")} تومان</td>
              <td>
                {order.isPaid ? (
                  order.paidAt.substring(0, 10)
                ) : (
                  <FaTimes style={{ color: "red" }} />
                )}
              </td>
              <td>{order.status}</td>
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
    </>
  );
}

export default OrderList;
