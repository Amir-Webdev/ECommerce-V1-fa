import { Alert } from "react-bootstrap";

function Message({ type = "info", children: message }) {
  return <Alert variant={type}>{message}</Alert>;
}

export default Message;
