import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogPosts } from '../data/mock';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32">
        {/* Hero */}
        <div className="bg-[#1B4B73] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Neuigkeiten, Rezepte und Geschichten aus der Welt von Oria Grill.
            </p>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 text-center shadow-md">
                    <span className="block text-2xl font-bold text-[#1B4B73]">{post.day}</span>
                    <span className="block text-xs text-gray-500 uppercase">{post.month}</span>
                    <span className="block text-xs text-gray-500">{post.year}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1B4B73] mb-3 line-clamp-2 hover:text-[#E8A54B] transition-colors">
                    <Link to={post.link}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#E8A54B] uppercase font-medium">
                      {post.category}
                    </span>
                    <Link
                      to={post.link}
                      className="text-sm text-[#1B4B73] font-medium hover:text-[#E8A54B] transition-colors"
                    >
                      Mehr lesen →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
