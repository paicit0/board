import React from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Notification from "@/components/Notification";

const Layout = ({ children }) => {
  return (
    <html>
      <body>
        <div>
          <Notification />
          <Navbar />
          <div>
            <title>Restaurant</title>
            <meta name="description" content="Welcome to the Restaurant!" />
            <link rel="icon" href="/favicon.ico" />
          </div>
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default Layout;
