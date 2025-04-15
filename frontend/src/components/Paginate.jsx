import { Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Paginate({ pages, page, isAdmin = false, keyword = "" }) {
  const navigate = useNavigate();

  return (
    pages > 1 && (
      <Pagination className="justify-content-end">
        {" "}
        {/* aligns right in RTL */}
        {Array.from({ length: pages }).map((_, x) => (
          <Pagination.Item
            active={x + 1 === page}
            key={x + 1}
            onClick={() =>
              navigate(
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
                  : `/admin/productlist/${x + 1}`
              )
            }
          >
            {x + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    )
  );
}

export default Paginate;
