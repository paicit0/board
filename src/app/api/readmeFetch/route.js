import { Octokit } from '@octokit/rest';
import { NextResponse } from 'next/server';

export async function GET() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN // Store your token in an environment variable for security
  });

  try {
    const { data } = await octokit.request('GET /repos/paicit0/board/readme', {
      owner: 'your-username',
      repo: 'your-repo',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
