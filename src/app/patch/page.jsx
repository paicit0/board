'use client'

import { useEffect, useState } from 'react';
import { marked } from 'marked';

export default function Home() {
  const [readme, setReadme] = useState('');

  useEffect(() => {
    async function fetchReadme() {
      const response = await fetch('https://api.github.com/repos/paicit0/board/readme');
      const { content } = await response.json();
      setReadme(marked(atob(content))); // decode base64 string and convert to html
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
