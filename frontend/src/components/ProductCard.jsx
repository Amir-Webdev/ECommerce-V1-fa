import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { formatNumber, toPersianDigits } from "../utils/toPersianDigits";

function ProductCard({ product }) {
  return (
    <Card className="my-3 p-3 rounded text-end">
      {" "}
      {/* text-end for RTL alignment */}
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating text={`${product.numReviews} نظر`} value={product.rating} />
        </Card.Text>
        <Card.Text as="h3">{formatNumber(product.price)} تومان</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
