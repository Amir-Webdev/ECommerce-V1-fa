import { Link, useNavigate, useParams } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../store/slices/api/productApiSlice";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import SEOMeta from "../../components/SEOMeta.jsx";

function ProductEdit() {
  const { id: productId } = useParams();
  const [product, setProduct] = useState({
    _id: "",
    name: "",
    price: 0,
    image: "",
    brand: "",
    category: "",
    countInStock: 0,
    description: "",
  });

  const navigate = useNavigate();

  const {
    data: productData,
    refetch,
    isLoading: isLoadingProduct,
    error: getProductError,
  } = useGetProductByIdQuery(productId);

  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductMutation(product);

  const [
    uploadProductImage,
  ] = useUploadProductImageMutation();

  useEffect(() => {
    if (productData) {
      setProduct({
        _id: productData._id,
        name: productData.name,
        price: productData.price,
        image: productData.image,
        brand: productData.brand,
        category: productData.category,
        countInStock: productData.countInStock,
        description: productData.description,
      });
    }
  }, [productData]);

  function handleChange(e) {
    setProduct({ ...product, [e.target.id]: e.target.value });
  }

  async function submitHandler(e) {
    e.preventDefault();
    const res = await updateProduct(product);
    if (res.error) {
      toast.error(res.error?.data?.message || res.error.message);
    } else {
      toast.success("محصول با موفقیت به‌روزرسانی شد");
      refetch();
      navigate("/admin/productlist");
    }
  }

  async function uploadImageHandler(e) {
    const file = e.target.files[0];
    if (!file) {
      toast.error("لطفاً یک فایل انتخاب کنید");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage({
        productId,
        formData,
      }).unwrap();

      toast.success(res.message);
      setProduct({ ...product, image: res.url });
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }

  return (
    <>
      <SEOMeta
        title={`ویرایش محصول | ${product.name} | مدیریت | فروشگاه بارین`}
        description={`جزئیات محصول ${product.name} را در پنل مدیریت فروشگاه بارین ویرایش کنید.`}
        keywords="ویرایش محصول، مدیریت، فروشگاه اینترنتی، فروشگاه بارین"
        canonical={window.location.href}
        openGraph={{
          title: `ویرایش محصول | ${product.name} | مدیریت | فروشگاه بارین`,
          description: `جزئیات محصول ${product.name} را در پنل مدیریت فروشگاه بارین ویرایش کنید.`,
          url: window.location.href,
        }}
      />

      <Link to="/admin/productlist" className="btn btn-light my-3 me-auto">
        بازگشت
      </Link>

      <FormContainer>
        <h1 className="text-end">ویرایش محصول</h1>

        {isUpdating && <Loader />}

        {isLoadingProduct ? (
          <Loader />
        ) : getProductError ? (
          <Message type="danger">{getProductError}</Message>
        ) : (
          <Form onSubmit={submitHandler} className="text-end">
            <Form.Group controlId="name" className="my-2">
              <Form.Label>نام</Form.Label>
              <Form.Control
                type="text"
                placeholder="نام محصول را وارد کنید"
                value={product.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="price" className="my-2">
              <Form.Label>قیمت</Form.Label>
              <Form.Control
                type="number"
                placeholder="قیمت را وارد کنید"
                value={product.price}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>تصویر</Form.Label>
              <Form.Control
                type="text"
                placeholder="آدرس تصویر را وارد کنید"
                value={product.image}
                onChange={handleChange}
              />
              <Form.Control
                type="file"
                label="انتخاب فایل"
                onChange={uploadImageHandler}
              />
            </Form.Group>

            <Form.Group controlId="brand" className="my-2">
              <Form.Label>برند</Form.Label>
              <Form.Control
                type="text"
                placeholder="برند را وارد کنید"
                value={product.brand}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>موجودی</Form.Label>
              <Form.Control
                type="text"
                placeholder="مقدار موجودی را وارد کنید"
                value={product.countInStock}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              <Form.Label>دسته‌بندی</Form.Label>
              <Form.Control
                type="text"
                placeholder="دسته‌بندی را وارد کنید"
                value={product.category}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>توضیحات</Form.Label>
              <Form.Control
                type="text"
                placeholder="توضیحات را وارد کنید"
                value={product.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
              به‌روزرسانی
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
}

export default ProductEdit;
