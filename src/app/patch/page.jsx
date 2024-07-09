'use client'

import { useEffect, useState } from 'react';
import { marked } from 'marked';

export default function Home() {
  const [readme, setReadme] = useState('');

  useEffect(() => {
    async function fetchReadme() {
      const response = await fetch('/api/readmeFetch');
      const data = await response.json();
      const html = marked(data.content);
      setReadme(html);
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