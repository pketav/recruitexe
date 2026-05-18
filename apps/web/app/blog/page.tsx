"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface Article {
  title: string;
  description?: string;
  date: string;
  readTime?: string;
  link: string;
  category: string;
}

const content = {
  featuredArticles: {
    title: "RecruitExe Blog Hub: Ideas That Work",
    articles: [
      {
        title: "AI in HR: Smarter Hiring & Seamless Onboarding",
        description: "Use cases and applications of how ai is transforming automation 1.From unbiased resume screening to 24/7 chatbots and personalised onboarding, AI is transforming HR into a faster, smarter, and more human-centric experience.01, 2023",
        readTime: "6 min read",
        date:"jul 31, 2025",
        link: "/blog/content/howAi",
        category: "HR Solutions",
      },
    ],
  },
  categories: ["All", "HR Solutions", "Technology", "Finance"],
  searchPlaceholder: "Search articles...",
};

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All"); 
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const articlesPerPage = 9;
  const maxVisiblePages = 5;

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredResults = content.featuredArticles.articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "All" || article.category === selectedCategory)
  );

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredResults.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredResults.length / articlesPerPage);

  const getPageNumbers = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900 text-white">
      <Header />

      {/* Category & Search */}
      <section className="w-full px-4 md:px-6 lg:px-8 py-6 mt-14">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {content.categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                } transition-all duration-300`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder={content.searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-full bg-black/20 border border-white/20 text-white placeholder-white"
            />
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-6 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            {content.featuredArticles.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentArticles.length > 0 ? (
              currentArticles.map((item, index) => (
                <Card
                  key={index}
                  className="overflow-hidden shadow-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Image
                    src="/placeholder.svg?height=338&width=600"
                    alt={`Article ${index + 1}`}
                    width={600}
                    height={338}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">{item.title}</CardTitle>
                    <CardDescription className="text-purple-200">
                      {item.date} • {item.readTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 text-sm mb-2 line-clamp-3">{item.description}</p>
                    <Link  href={item.link} className="text-purple-300 hover:text-cyan-300">
                      Read More
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-purple-200 col-span-full">No articles found.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
              >
                Previous
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-full ${
                    currentPage === page
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
}