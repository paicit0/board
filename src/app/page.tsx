import React from "react";
import Link from 'next/link'

const HomePage = () => {
  return (
    <div>
      
      <div>Homepage</div>
      <Link href="/" passHref>
        Home
      </Link>

      <Link href="/menu">
        Menu
      </Link>

      <Link href="/product">
        Product
      </Link>
    </div>
  )
}

export default HomePage
