'use client'

import { useEffect, useState } from 'react';
import { marked } from 'marked';

export default function Home() {
  const [readme, setReadme] = useState('');

  useEffect(() => {
    async function fetchReadme() {
      try {
        const response = await fetch('https://api.github.com/repos/paicit0/board/readme')
        const data = await response.json();
        const readmeContent = atob(data.content); // decodes base64 string
        console.log(readmeContent);
        setReadme(marked(readmeContent)); // markdown to html
      } catch (error) {
        console.error('Error fetching README:', error);
      }
    }

    fetchReadme();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Features</h1>

      {/* Displaying the README content as HTML using dangerouslySetInnerHTML */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: readme }} />
    </div>
  );
}
