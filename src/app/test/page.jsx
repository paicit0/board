'use client'

import React, { useState, useEffect } from 'react';

const DataFetcher = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const url = 'https://dummyjson.com/products';

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await fetch(url);
            const result = await response.json();
            setItems(result.products); // Set the items state with the fetched products
            setFilteredItems(result.products); // Initialize the filtered items with all products
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    function showDefault() {
        setFilteredItems(items); // Show all products
    }

    function showPriceGreaterThanFive() {
        const filtered = items.filter(item => item.price > 5);
        setFilteredItems(filtered); // Show products with price > $5
    }

    return (
        <div>
            <h1>Items</h1>
            <button onClick={showDefault}>Show Default</button>
            <p>-----</p>
            <button onClick={showPriceGreaterThanFive}>Show Products with Price &gt; $5</button>
            <ul>
                {filteredItems.map(item => (
                    <li key={item.id}>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
                        <img src={item.thumbnail} alt={item.title} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DataFetcher;
