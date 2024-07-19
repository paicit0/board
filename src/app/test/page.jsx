'use client'

import React, { useState, useEffect } from 'react';

const DataFetcher = () => {
    const [items, setItems] = useState([]); // State to store all fetched items
    const [viewMode, setViewMode] = useState('default'); // State to track the current view mode
    const url = 'https://dummyjson.com/products';

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await fetch(url);
            const result = await response.json();
            setItems(result.products); // Set the items state with the fetched products
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    const filteredItems = items.filter(item => {
        if (viewMode === 'priceGreaterThanFive') {
            return item.price > 5;
        }
        return true;
    });

    return (
        <div>
            <h1>Items</h1>
            <button className="btn btn-blue" onClick={() => setViewMode('default')}>Show Default</button>
            <br />
            <button className="btn btn-blue" onClick={() => setViewMode('priceGreaterThanFive')}>Show Products with Price &gt; $5</button>
            <br />
            <button className="btn btn-blue" onClick={() => setViewMode('titleAndPriceOnly')}>Show Only Title and Price</button>
            
            <ul>
                {filteredItems.map(item => (
                    <li key={item.id}>
                        <h2>{item.title}</h2>
                        <p>Price: ${item.price.toFixed(2)}</p>
                        {viewMode !== 'titleAndPriceOnly' && (
                            <>
                                <p>{item.description}</p>
                                <img src={item.thumbnail} alt={item.title} />
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DataFetcher;
