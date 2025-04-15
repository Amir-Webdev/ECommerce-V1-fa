import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function SearchBox() {
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");
  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();

    if (keyword.trim()) {
      setKeyword("");
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  }

  return (
    <Form
      onSubmit={submitHandler}
      className="d-flex align-items-center"
      style={{ position: "relative" }}
    >
      <Button
        type="submit"
        variant="outline-light"
        className="p-2 ms-2"
        style={{
          borderRadius: "20px",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0d6efd")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
      >
        جستجو
      </Button>
      <Form.Control
        type="text"
        name="q"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="جستجوی محصولات..."
        className="text-end me-2"
        dir="rtl"
        style={{
          borderRadius: "20px",
          padding: "0.5rem 1rem",
          transition: "border-color 0.3s",
        }}
      />
    </Form>
  );
}

export default SearchBox;
