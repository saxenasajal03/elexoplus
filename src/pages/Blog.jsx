import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { getCmsContent, defaultBlogPosts } from '../data/siteContent';

export default function Blog() {
  const [posts, setPosts] = useState(defaultBlogPosts);

  useEffect(() => {
    getCmsContent('blog', defaultBlogPosts).then(setPosts);
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Blog & Insights"
        title="Guides, Tips & Leadership Thoughts"
        subtitle="Buying guides, product care tips, and messages from our leadership — updated regularly by our editorial team."
      />

      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <Link
            key={post.id ?? idx}
            to={`/blog/${post.slug}`}
            className="group bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-400/40 transition-colors flex flex-col"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/1A1A1A/FFFFFF?text=ElexoPlus"; }}
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <span className="text-amber-400 text-[11px] font-extrabold uppercase tracking-wider">{post.category}</span>
              <h3 className="text-white font-extrabold text-lg mt-2 leading-snug group-hover:text-amber-400 transition-colors">{post.title}</h3>
              <p className="text-zinc-400 text-xs mt-3 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-800 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1.5"><User size={12} /> {post.author}</span>
                <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <span className="mt-4 text-xs font-bold text-amber-400 flex items-center gap-1">
                Read More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
