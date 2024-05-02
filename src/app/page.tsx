import React from 'react';
import { restaurantData } from 'data/restaurantData';

const HomePage = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {restaurantData.map((restaurant, index) => (
        <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg">
          <img className="w-full" src={restaurant.image} alt={restaurant.name} />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{restaurant.name}</div>
            <p className="text-gray-700 text-base">
              Rating: {restaurant.rating} ({restaurant.reviews} reviews)
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
