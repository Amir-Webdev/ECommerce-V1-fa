import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import Lottie from "lottie-react";
import notFoundAnimation from "../animation/404NotFound.animation.json";
import SEOMeta from "../components/SEOMeta.jsx";

const NotFound = () => {
  // Styles object (updated for RTL)
  const styles = {
    container: {
      color: "#495057",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "2rem",
      textAlign: "center",
    },
    animationContainer: {
      width: "100%",
      maxWidth: "400px",
      height: "auto",
      margin: "0 auto 2rem",
    },
    heading: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: "rgba(123, 138, 139, 1)",
      marginBottom: "1rem",
    },
    text: {
      fontSize: "1.25rem",
      color: "#6c757d",
      marginBottom: "2rem",
      direction: "rtl", // Added for Persian text
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      marginTop: "1rem",
      justifyContent: "center",
      flexWrap: "wrap",
      flexDirection: "row-reverse", // Reversed button order for RTL
    },
    buttonPrimary: {
      backgroundColor: "rgba(123, 138, 139, 1)",
      borderColor: "rgba(123, 138, 139, 1)",
      padding: "0.5rem 2rem",
    },
    buttonSecondary: {
      color: "rgba(123, 138, 139, 1)",
      borderColor: "rgba(123, 138, 139, 1)",
      padding: "0.5rem 2rem",
    },
  };

  return (
    <>
      {/* Updated SEO Meta for Persian */}
      <SEOMeta
        title="صفحه پیدا نشد | بارین مارکت"
        description="صفحه ای که به دنبال آن هستید وجود ندارد یا منتقل شده است"
        keywords="خطای ۴۰۴, صفحه پیدا نشد, فروشگاه اینترنتی, بارین مارکت"
        canonical={window.location.href}
        openGraph={{
          title: "صفحه پیدا نشد | بارین مارکت",
          description:
            "صفحه ای که به دنبال آن هستید وجود ندارد یا منتقل شده است",
          url: window.location.href,
        }}
      />

      <div style={styles.container}>
        <div style={styles.animationContainer}>
          <Lottie
            animationData={notFoundAnimation}
            loop={true}
            autoplay={true}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        <h1 style={styles.heading}>صفحه مورد نظر یافت نشد</h1>
        <p style={styles.text}>
          صفحه ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
          <br />
          اجازه دهید شما را به مسیر درست هدایت کنیم.
        </p>

        <div style={styles.buttonGroup}>
          <Button as={Link} to="/" style={styles.buttonPrimary} size="lg">
            بازگشت به صفحه اصلی
          </Button>
          <Button
            variant="outline-secondary"
            size="lg"
            onClick={() => window.history.back()}
            style={styles.buttonSecondary}
          >
            بازگشت به صفحه قبل
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
