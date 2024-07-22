'use client'

import { useEffect, useState } from 'react';
import { marked } from 'marked';

export default function Home() {
  const [readme, setReadme] = useState('');

  useEffect(() => {
    async function fetchReadme() {
      try {
        const response = await fetch('https://api.github.com/repos/paicit0/board/readme', {
          headers: {
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        const readmeContent = atob(data.content);
        setReadme(marked(readmeContent));
      } catch (error) {
        console.error('Error fetching README:', error);
      }
    }

    fetchReadme();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Features</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: readme }} />
    </div>
  );
}
