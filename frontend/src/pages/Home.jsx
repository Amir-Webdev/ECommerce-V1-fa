import { Row, Col, Container, Spinner, Alert } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import { useGetProductsQuery } from "../store/slices/api/productApiSlice.js";
import Loader from "../components/Loader.jsx";
import { Link, useParams } from "react-router-dom";
import Paginate from "../components/Paginate.jsx";
import ProductsCarousel from "../components/ProductsCarousel.jsx";
import SEOMeta from "../components/SEOMeta.jsx";
import Message from "../components/Message.jsx";

function Home() {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const seoTitle = keyword
    ? `نتایج جستجو برای "${keyword}" | بارین مارکت`
    : "به فروشگاه بارین مارکت خوش آمدید";
  const seoDescription = keyword
    ? `محصولات مرتبط با "${keyword}" را در فروشگاه ما بیابید.`
    : "جدیدترین محصولات و تخفیف‌ها را در فروشگاه ما کشف کنید.";
  const seoKeywords = keyword
    ? `${keyword}, فروشگاه اینترنتی, محصولات`
    : "فروشگاه اینترنتی, محصولات, تخفیف‌ها, خرید";

  return (
    <>
      <SEOMeta
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={window.location.href}
        openGraph={{
          title: seoTitle,
          description: seoDescription,
          url: window.location.href,
        }}
      />

      <Container className="py-3 text-end">
        {!keyword ? (
          <ProductsCarousel />
        ) : (
          <Link to="/" className="btn btn-light mb-3">
            بازگشت به صفحه اصلی
          </Link>
        )}
        <h1 className="mb-4">{!keyword ? "آخرین محصولات" : "نتایج جستجو"}</h1>
        {isLoading ? (
          <div className="text-center">
            <Loader />
            <p>در حال بارگذاری محصولات...</p>
          </div>
        ) : error ? (
          <Message type="danger">
            {error?.data?.message || error?.error}
          </Message>
        ) : (
          <>
            <Row>
              {data.products.length >= 1 ? (
                data.products.map((product) => (
                  <Col
                    key={product._id}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3}
                    className="mb-4"
                  >
                    <ProductCard product={product} />
                  </Col>
                ))
              ) : (
                <Col>
                  <Alert variant="info" className="text-end">
                    محصولی یافت نشد
                  </Alert>
                </Col>
              )}
            </Row>
            <Paginate
              page={data.page}
              pages={data.pages}
              keyword={keyword ? keyword : ""}
              isRTL={true}
            />
          </>
        )}
      </Container>
    </>
  );
}

export default Home;
