import { Carousel, Image } from "react-bootstrap";
import { useGetTopProductsQuery } from "../store/slices/api/productApiSlice";
import Loader from "./Loader";
import Message from "./Message";
import { Link } from "react-router-dom";
import { formatNumber } from "../utils/toPersianDigits";

function ProductsCarousel() {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">
      {error?.data?.message || error?.error || "خطا در بارگذاری محصولات"}
    </Message>
  ) : (
    <Carousel
      pause="hover"
      style={{
        backgroundColor: "#212529",
        marginBottom: "1.5rem",
        borderRadius: "0.375rem",
        direction: "rtl", // Make sure carousel content respects RTL
      }}
      indicators={products.length > 1}
      controls={products.length > 1}
    >
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <div style={{ position: "relative" }}>
            <Link to={`/product/${product._id}`}>
              <Image
                src={product.image}
                alt={product.name}
                fluid
                style={{
                  display: "block",
                  marginRight: "auto", // RTL: right auto
                  marginLeft: "auto",
                  maxHeight: "600px",
                  objectFit: "contain",
                  width: "auto",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "50%", // flipped from left
                  transform: "translateX(50%)", // flip translate
                  backgroundColor: "rgba(33, 37, 41, 0.75)",
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  width: "auto",
                  maxWidth: "80%",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <h3 style={{ marginBottom: "0.25rem", fontSize: "1.75rem" }}>
                  {product.name}
                </h3>
                <p style={{ marginBottom: 0 }}>
                  {formatNumber(product.price)} تومان
                </p>
              </div>
            </Link>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductsCarousel;
