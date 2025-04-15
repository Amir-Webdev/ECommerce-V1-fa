import { Nav, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaTruck,
  FaCreditCard,
  FaClipboardCheck,
} from "react-icons/fa";

function CheckoutSteps({ step }) {
  const navigate = useNavigate();

  const steps = [
    { id: 1, path: "/login", label: "ورود", icon: <FaCheck /> },
    { id: 2, path: "/shipping", label: "اطلاعات ارسال", icon: <FaTruck /> },
    { id: 3, path: "/payment", label: "پرداخت", icon: <FaCreditCard /> },
    {
      id: 4,
      path: "/placeorder",
      label: "ثبت سفارش",
      icon: <FaClipboardCheck />,
    },
  ];

  const styles = {
    container: {
      margin: "2rem 0",
      padding: "0 1rem",
    },
    nav: {
      display: "flex",
      justifyContent: "space-between",
      position: "relative",
      direction: "rtl", // RTL adjustment
    },
    stepItem: {
      flex: 1,
      position: "relative",
      textAlign: "center",
      minWidth: "80px",
    },
    stepConnector: {
      position: "absolute",
      top: "30px",
      right: "-50%", // RTL adjustment
      width: "100%",
      zIndex: 1,
    },
    connectorLine: {
      height: "2px",
      backgroundColor: "#dee2e6",
      width: "100%",
    },
    activeConnector: {
      backgroundColor: "#0d6efd",
    },
    stepLink: {
      position: "relative",
      zIndex: 2,
      background: "white",
      border: "2px solid #dee2e6",
      color: "#6c757d",
      borderRadius: "50%",
      width: "60px",
      height: "60px",
      margin: "0 auto",
      padding: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
      cursor: "pointer",
      overflow: "visible",
    },
    activeStep: {
      borderColor: "#0d6efd",
      color: "#0d6efd",
      backgroundColor: "#f8f9fa",
    },
    currentStep: {
      transform: "scale(1.1)",
      boxShadow: "0 0 0 4px rgba(13, 110, 253, 0.25)",
    },
    stepIcon: {
      fontSize: "1.2rem",
      marginBottom: "0.25rem",
    },
    stepLabel: {
      fontSize: "0.8rem",
      fontWeight: 500,
      marginTop: "0.5rem",
      whiteSpace: "nowrap",
      position: "absolute",
      bottom: "-25px",
      right: "50%", // RTL adjustment
      transform: "translateX(50%)",
      width: "100%",
      textAlign: "center",
    },
    completedBadge: {
      position: "absolute",
      top: "-5px",
      left: "-5px", // RTL adjustment
      background: "#198754",
      color: "white",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.6rem",
    },
    disabledLink: {
      cursor: "not-allowed",
      opacity: 0.6,
      backgroundColor: "white",
      borderColor: "#dee2e6",
    },
  };

  return (
    <div style={styles.container}>
      <Nav style={styles.nav} variant="pills">
        {steps.map(({ id, path, label, icon }) => (
          <Nav.Item key={id} style={styles.stepItem}>
            {id > 1 && (
              <div style={styles.stepConnector}>
                <div
                  style={{
                    ...styles.connectorLine,
                    ...(step >= id ? styles.activeConnector : {}),
                    display: step < id ? "none" : "block",
                  }}
                />
              </div>
            )}

            <Nav.Link
              style={{
                ...styles.stepLink,
                ...(step >= id ? styles.activeStep : {}),
                ...(step === id ? styles.currentStep : {}),
                ...(step < id ? styles.disabledLink : {}),
              }}
              onClick={() => step >= id && navigate(path)}
              disabled={step < id}
            >
              <div style={styles.stepIcon}>
                {step > id ? (
                  icon
                ) : (
                  <Badge bg={step >= id ? "primary" : "secondary"}>{id}</Badge>
                )}
              </div>
              {step > id && (
                <div style={styles.completedBadge}>
                  <FaCheck />
                </div>
              )}
            </Nav.Link>

            <div style={styles.stepLabel}>{label}</div>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
}

export default CheckoutSteps;
