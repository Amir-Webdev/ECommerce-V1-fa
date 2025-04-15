import { useNavigate } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../store/slices/api/userApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import SEOMeta from "../../components/SEOMeta.jsx";

function UserList() {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: deletingUser, error: errorDeletingUser }] =
    useDeleteUserMutation();

  const navigate = useNavigate();

  async function deleteHandler(userId) {
    if (window.confirm("آیا از حذف این کاربر اطمینان دارید؟")) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("کاربر با موفقیت حذف شد");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message type="danger">
      {error?.data?.message || error.error || "خطا در بارگذاری کاربران"}
    </Message>
  ) : (
    <>
      <SEOMeta
        title="لیست کاربران | مدیریت | فروشگاه بارین"
        description="نمایش و مدیریت همه کاربران در پنل مدیریت فروشگاه بارین."
        keywords="لیست کاربران، مدیریت، فروشگاه اینترنتی، بارین"
        canonical={window.location.href}
        openGraph={{
          title: "لیست کاربران | مدیریت | فروشگاه بارین",
          description:
            "نمایش و مدیریت همه کاربران در پنل مدیریت فروشگاه بارین.",
          url: window.location.href,
        }}
      />

      <h1>کاربران</h1>

      <Table striped hover responsive className="table-sm">
        <thead>
          <tr>
            <th>شناسه</th>
            <th>نام</th>
            <th>ایمیل</th>
            <th>مدیر</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </td>
              <td>
                {user.isAdmin ? (
                  <FaCheck style={{ color: "green" }} />
                ) : (
                  <FaTimes style={{ color: "red" }} />
                )}
              </td>
              <td>
                <Button
                  className="btn-sm mx-2"
                  variant="light"
                  onClick={() => navigate(`/admin/user/${user._id}/edit`)}
                >
                  <FaEdit />
                </Button>
                <Button
                  className="btn-sm mx-2"
                  variant="danger"
                  onClick={() => deleteHandler(user._id)}
                >
                  <FaTrash style={{ color: "white" }} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {deletingUser && <Loader />}
    </>
  );
}

export default UserList;
