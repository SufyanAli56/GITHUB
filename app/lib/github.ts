// app/lib/github.ts
import axios from 'axios';

export async function searchGitHubUsers(query: string) {
  try {
    const response = await axios.get(
      `https://api.github.com/search/users`,
      {
        params: {
          q: query,
          per_page: 10 // Limit results
        },
        headers: {
          // Add your GitHub token if needed
          Authorization: process.env.GITHUB_TOKEN 
            ? `Bearer ${process.env.GITHUB_TOKEN}`
            : "",
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    return response.data.items || [];
  } catch (error: any) {
    console.error("GitHub API error:", error.message);
    throw new Error(`GitHub API error: ${error.response?.status || error.message}`);
  }
}