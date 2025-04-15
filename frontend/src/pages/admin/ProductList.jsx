import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../store/slices/api/productApiSlice";
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { Table, Button, Row, Col } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";
import SEOMeta from "../../components/SEOMeta.jsx";
import { formatNumber } from "../../utils/toPersianDigits.js";

function ProductList() {
  const { pageNumber } = useParams();

  const {
    data,
    refetch,
    isLoading: loadingProducts,
    getProductsError,
  } = useGetProductsQuery({ pageNumber });

  const [
    createProduct,
    { isLoading: isCreatingProduct, error: createProductError },
  ] = useCreateProductMutation();

  const [deleteProduct, { isLoading: isDeletingProduct }] =
    useDeleteProductMutation();

  const navigate = useNavigate();

  async function deleteHandler(productId) {
    if (window.confirm(`آیا از حذف محصول با شناسه ${productId} مطمئن هستید؟`)) {
      try {
        await deleteProduct(productId);
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  }

  async function createProductHandler() {
    if (window.confirm("آیا از ایجاد محصول جدید مطمئن هستید؟")) {
      try {
        await createProduct();
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  }

  return (
    <>
      <SEOMeta
        title="لیست محصولات | مدیریت | فروشگاه بارین"
        description="نمایش و مدیریت محصولات توسط مدیر در فروشگاه اینترنتی بارین."
        keywords="لیست محصولات، مدیریت، فروشگاه، بارین"
        canonical={window.location.href}
        openGraph={{
          title: "لیست محصولات | مدیریت | فروشگاه بارین",
          description:
            "نمایش و مدیریت محصولات توسط مدیر در فروشگاه اینترنتی بارین.",
          url: window.location.href,
        }}
      />

      <Row className="align-items-center">
        <Col>
          <h1>محصولات</h1>
        </Col>
        <Col className="text-start">
          {" "}
          {/* flipped from text-end */}
          <Button className="btn-sm m-3" onClick={createProductHandler}>
            ایجاد محصول
            <FaEdit style={{ marginRight: "6px" }} />
          </Button>
        </Col>
      </Row>

      {isCreatingProduct && <Loader />}
      {isDeletingProduct && <Loader />}

      {loadingProducts ? (
        <Loader />
      ) : getProductsError ? (
        <Message type="danger">{getProductsError}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>شناسه</th>
                <th>نام</th>
                <th>قیمت</th>
                <th>دسته‌بندی</th>
                <th>برند</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{formatNumber(product.price)} تومان</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      className="btn-sm mx-2"
                      variant="light"
                      onClick={() =>
                        navigate(`/admin/product/${product._id}/edit`)
                      }
                    >
                      <FaEdit style={{ marginRight: "4px" }} />
                    </Button>
                    <Button
                      className="btn-sm mx-2"
                      variant="danger"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: "white", marginRight: "4px" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
}

export default ProductList;
