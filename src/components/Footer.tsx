import React from "react";

const Footer = () => {
  return (
     <div>
            <div
                style={{
                    minHeight: "400px",
                    color: "green",
                }}
            >
                <h1>GeeksforGeeks</h1>
            </div>
            <Footer />
        </div>
  )
}

export default Footer