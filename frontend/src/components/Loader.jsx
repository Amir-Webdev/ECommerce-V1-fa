import { Spinner } from "react-bootstrap";

function Loader() {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "75px",
        height: "75px",
        margin: "auto",
        display: "block",
      }}
    ></Spinner>
  );
}

export default Loader;
