import { Link, useNavigate, useParams } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../store/slices/api/userApiSlice";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import SEOMeta from "../../components/SEOMeta.jsx";

function UserEdit() {
  const { id: userId } = useParams();
  const [user, setUser] = useState({
    _id: "",
    name: "",
    email: "",
    isAdmin: false,
  });

  const navigate = useNavigate();

  const {
    data: userData,
    refetch,
    isLoading: isLoadingUser,
    error: getUserError,
  } = useGetUserByIdQuery(userId);

  const [updateUser, { isLoading: isUpdating, error: updateUserError }] =
    useUpdateUserMutation();

  useEffect(() => {
    if (userData) {
      setUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        isAdmin: Boolean(userData.isAdmin),
      });
    }
  }, [userData]);

  function handleChange(e) {
    setUser({ ...user, [e.target.id]: e.target.value });
  }

  async function submitHandler(e) {
    e.preventDefault();
    try {
      await updateUser(user).unwrap();
      toast.success("کاربر با موفقیت ویرایش شد");
      refetch();
      navigate("/admin/userlist");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }

  return (
    <>
      <SEOMeta
        title={`ویرایش کاربر | ${user.name} | مدیریت | فروشگاه بارین`}
        description={`ویرایش اطلاعات کاربر ${user.name} در پنل مدیریت فروشگاه بارین.`}
        keywords="ویرایش کاربر، مدیریت، فروشگاه اینترنتی، بارین"
        canonical={window.location.href}
        openGraph={{
          title: `ویرایش کاربر | ${user.name} | مدیریت | فروشگاه بارین`,
          description: `ویرایش اطلاعات کاربر ${user.name} در پنل مدیریت فروشگاه بارین.`,
          url: window.location.href,
        }}
      />

      <Link to="/admin/userlist" className="btn btn-light my-3">
        بازگشت
      </Link>

      <FormContainer>
        <h1>ویرایش کاربر</h1>

        {isUpdating && <Loader />}

        {isLoadingUser ? (
          <Loader />
        ) : getUserError ? (
          <Message type="danger">{getUserError}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>نام</Form.Label>
              <Form.Control
                type="text"
                placeholder="نام را وارد کنید"
                value={user.name}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            <Form.Group controlId="email" className="my-2">
              <Form.Label>ایمیل</Form.Label>
              <Form.Control
                type="email"
                placeholder="ایمیل را وارد کنید"
                value={user.email}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            <Form.Group controlId="isAdmin" className="my-2">
              <Form.Check
                type="checkbox"
                label="مدیر است"
                checked={user.isAdmin}
                onChange={(e) =>
                  setUser({ ...user, isAdmin: e.target.checked })
                }
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
              ذخیره تغییرات
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
}

export default UserEdit;
