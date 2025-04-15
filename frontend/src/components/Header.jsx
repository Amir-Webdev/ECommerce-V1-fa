import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useLogoutMutation } from "../store/slices/api/userApiSlice";
import { logout } from "../store/slices/auth/authSlice";
import { resetCart } from "../store/slices/cart/cartSlice";
import SearchBox from "./SearchBox";

function Header() {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [callLogoutApi] = useLogoutMutation();

  async function logoutHandler() {
    try {
      await callLogoutApi().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <header dir="rtl">
      <Navbar
        bg="dark"
        variant="dark"
        expand="md"
        collapseOnSelect
        className="mb-3"
      >
        <Container>
          {/* Brand Logo */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src="https://ecommerce-v1.s3.ir-thr-at1.arvanstorage.ir/Default%2Flogo.png?versionId="
              alt="بارین"
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "5px",
                width: "50px",
                height: "50px",
                objectFit: "contain",
                marginLeft: "12px",
              }}
            />
            <span
              className="ms-4"
              style={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
              بارین
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="d-flex justify-content-between w-100"
          >
            {/* Search Box in between Logo and Dropdowns */}
            <div className="w-50">
              <SearchBox />
            </div>

            <Nav className="d-flex justify-content-end w-100">
              {/* Cart */}
              <Nav.Link
                as={Link}
                to="/cart"
                className="d-flex align-items-center"
              >
                <FaShoppingCart className="ms-2" />
                سبد خرید
                {cartItems.length > 0 && (
                  <Badge pill bg="success" className="me-1">
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                  </Badge>
                )}
              </Nav.Link>

              {/* User Profile / Login */}
              {userInfo ? (
                <NavDropdown
                  title={userInfo.name}
                  id="username"
                  align="end"
                  className="ms-3"
                  style={{ marginRight: "5px" }}
                >
                  <NavDropdown.Item onClick={() => navigate("/profile")}>
                    پروفایل
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    خروج
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="d-flex align-items-center ms-3"
                >
                  <FaUser className="ms-2" />
                  ورود
                </Nav.Link>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title="مدیریت"
                  id="adminmenu"
                  align="end"
                  className="ms-3"
                >
                  <NavDropdown.Item
                    onClick={() => navigate("/admin/productlist")}
                  >
                    محصولات
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/admin/userlist")}>
                    کاربران
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => navigate("/admin/orderlist")}
                  >
                    سفارشات
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
