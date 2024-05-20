'use client';

import React from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Notification from "@/components/Notification";
import { AuthProvider } from "./Providers";

  const Layout = ({ children }) => {
    return (
      <html>
        <head>
          <title>Board</title>
          <meta name="description" content="Welcome to the board." />
        </head>
        <body>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </body>
      </html>
    );
  };
  
  export default Layout;