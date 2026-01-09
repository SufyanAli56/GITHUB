"use client";

import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { motion } from "framer-motion";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  visibility: string;
  topics: string[];
}

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  location?: string;
  bio?: string;
  created_at: string;
  repos: GitHubRepo[];
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setUsers([]);

    try {
      const res = await fetch(`/api/github?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (res.ok) {
        setUsers(data || []);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Modern Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo & Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center space-x-4"
          >
            <div className="relative">
              <svg className="w-10 h-10 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                GitHub Finder
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Discover • Connect • Explore</p>
            </div>
          </motion.div>

          {/* Auth Section */}
          <SignedOut>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center space-x-4"
            >
              <SignInButton mode="modal">
                <button className="px-6 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  Get Started Free
                </button>
              </SignUpButton>
            </motion.div>
          </SignedOut>

          <SignedIn>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-11 h-11 ring-4 ring-white shadow-xl",
                  },
                }}
              />
            </motion.div>
          </SignedIn>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-20">
        <SignedOut>
          {/* Hero for Signed Out */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto mt-20"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Find Any GitHub Profile
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Instantly
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl">
              Search millions of developers, explore their repositories, followers, and contributions — all in one beautiful place.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <SignUpButton mode="modal">
                <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all">
                  Start Searching Now
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="px-10 py-5 bg-white text-gray-800 text-lg font-semibold rounded-2xl shadow-xl border border-gray-200 hover:bg-gray-50 transition-all">
                  I Already Have an Account
                </button>
              </SignInButton>
            </div>
          </motion.div>
        </SignedOut>

        <SignedIn>
          <div className="max-w-7xl mx-auto px-6">
            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-10">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">
                  Search GitHub Users
                </h2>

                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      className="w-full px-8 py-6 pr-14 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-inner"
                      placeholder="Enter username (e.g., torvalds, gaearon, octocat)"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <svg
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-7 h-7 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-70 disabled:transform-none transition-all duration-300 shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Searching...
                      </span>
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="mt-6 text-xl text-gray-600">Searching GitHub...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-2xl text-center">
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {users.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="group bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl border border-white/30 overflow-hidden transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="relative">
                          <img
                            src={user.avatar_url}
                            alt={user.login}
                            className="w-20 h-20 rounded-full ring-4 ring-white shadow-xl"
                          />
                          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full ring-4 ring-white"></div>
                        </div>
                        <div className="ml-5">
                          <h3 className="text-2xl font-bold text-gray-900">{user.login}</h3>
                          <p className="text-sm text-gray-500">@{user.login}</p>
                        </div>
                      </div>

                      {user.bio && (
                        <p className="text-gray-700 mb-6 line-clamp-3 leading-relaxed">
                          {user.bio}
                        </p>
                      )}

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                          <div className="text-2xl font-bold text-blue-700">
                            {user.followers.toLocaleString()}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">Followers</div>
                        </div>
                        <div className="text-center p-4 bg-emerald-50 rounded-xl">
                          <div className="text-2xl font-bold text-emerald-700">
                            {user.following.toLocaleString()}
                          </div>
                          <div className="text-xs text-emerald-600 font-medium">Following</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-xl">
                          <div className="text-2xl font-bold text-purple-700">{user.public_repos}</div>
                          <div className="text-xs text-purple-600 font-medium">Repos</div>
                        </div>
                      </div>

                      {user.location && (
                        <div className="flex items-center text-gray-600 mb-4">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{user.location}</span>
                        </div>
                      )}

                      <div className="text-sm text-gray-500 mb-6">
                        Joined {formatDate(user.created_at)}
                      </div>

                      <a
                        href={user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <button className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          View on GitHub
                        </button>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && users.length === 0 && query && !error && (
              <div className="text-center py-20">
                <div className="bg-gray-100 rounded-3xl p-12 max-w-md mx-auto">
                  <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-2xl font-semibold text-gray-700 mb-2">
                    No users found
                  </p>
                  <p className="text-gray-500">
                    Try searching for "octocat", "torvalds", or "gaearon"
                  </p>
                </div>
              </div>
            )}
          </div>
        </SignedIn>
      </main>
    </>
  );
}