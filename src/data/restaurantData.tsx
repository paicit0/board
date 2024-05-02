export interface Restaurant {
    name: string;
    image: string;
    rating: number;
    reviews: number;
  }
  
  export const restaurantData: Restaurant[] = [
    {
      name: "Chithole Royal river Hotel",
      image: "/images/chithole.jpg",
      rating: 4.5,
      reviews: 10
    },
    {
      name: "Starbucks Major Cineplex",
      image: "/images/starbucks.jpg",
      rating: 4.0,
      reviews: 4
    },
    // Add more restaurants here
  ];
  