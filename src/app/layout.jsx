import React from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Notification from "@/components/Notification";
import { AuthProvider } from "./Providers";
import { signIn, signOut, useSession } from "next-auth/react";


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
          </div>
          <AuthProvider>{children}</AuthProvider>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default Layout;
