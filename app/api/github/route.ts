// app/api/github/route.ts (updated to include repositories)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const includeRepos = searchParams.get('includeRepos') === 'true'; // Optional flag

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.github.com/search/users?q=${query}&per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'User-Agent': 'Your-App-Name',
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Fetch detailed information for each user
    const detailedUsers = await Promise.all(
      data.items.map(async (user: any) => {
        try {
          // Fetch user details
          const userDetailsResponse = await fetch(user.url, {
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
              'User-Agent': 'Your-App-Name',
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          
          if (userDetailsResponse.ok) {
            const userDetails = await userDetailsResponse.json();
            
            // Initialize user object
            const userObj = {
              login: userDetails.login,
              id: userDetails.id,
              avatar_url: userDetails.avatar_url,
              html_url: userDetails.html_url,
              followers: userDetails.followers,
              following: userDetails.following,
              public_repos: userDetails.public_repos,
              location: userDetails.location,
              bio: userDetails.bio,
              created_at: userDetails.created_at,
              repos: [] as any[] // Initialize empty repos array
            };
            
            // If includeRepos flag is true, fetch repositories
            if (includeRepos && userDetails.public_repos > 0) {
              try {
                const reposResponse = await fetch(
                  `https://api.github.com/users/${userDetails.login}/repos?per_page=100&sort=updated&direction=desc`,
                  {
                    headers: {
                      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                      'User-Agent': 'Your-App-Name',
                      'Accept': 'application/vnd.github.v3+json'
                    }
                  }
                );
                
                if (reposResponse.ok) {
                  const repos = await reposResponse.json();
                  // Map to include only necessary fields to keep response size manageable
                  userObj.repos = repos.map((repo: any) => ({
                    id: repo.id,
                    name: repo.name,
                    full_name: repo.full_name,
                    html_url: repo.html_url,
                    description: repo.description,
                    stargazers_count: repo.stargazers_count,
                    forks_count: repo.forks_count,
                    language: repo.language,
                    updated_at: repo.updated_at,
                    created_at: repo.created_at,
                    visibility: repo.visibility,
                    topics: repo.topics || []
                  }));
                }
              } catch (repoError) {
                console.error(`Error fetching repos for ${userDetails.login}:`, repoError);
                // Continue without repos if there's an error
              }
            }
            
            return userObj;
          }
          
          // Fallback if user details fetch fails
          return {
            login: user.login,
            id: user.id,
            avatar_url: user.avatar_url,
            html_url: user.html_url,
            followers: 0,
            following: 0,
            public_repos: 0,
            created_at: user.created_at || new Date().toISOString(),
            repos: []
          };
        } catch (error) {
          console.error(`Error fetching details for ${user.login}:`, error);
          return {
            login: user.login,
            id: user.id,
            avatar_url: user.avatar_url,
            html_url: user.html_url,
            followers: 0,
            following: 0,
            public_repos: 0,
            created_at: new Date().toISOString(),
            repos: []
          };
        }
      })
    );

    return NextResponse.json(detailedUsers);
  } catch (error: any) {
    console.error('GitHub search error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}