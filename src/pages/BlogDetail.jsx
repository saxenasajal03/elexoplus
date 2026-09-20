import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { getCmsContent, defaultBlogPosts } from '../data/siteContent';

export default function BlogDetail() {
  const { slug } = useParams();
  const [posts, setPosts] = useState(defaultBlogPosts);

  useEffect(() => {
    getCmsContent('blog', defaultBlogPosts).then(setPosts);
  }, []);

  const post = posts.find(p => p.slug === slug) || defaultBlogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 pt-32 px-6 text-center">
        <p className="text-zinc-500">Article not found.</p>
        <Link to="/blog" className="text-amber-600 hover:underline text-sm mt-4 inline-block">&larr; Back to Blog</Link>
      </div>
    );
  }

  const related = posts.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-white text-slate-100 font-sans selection:bg-amber-400 selection:text-black pt-28 md:pt-36 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-600 mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        <span className="text-amber-600 text-xs font-extrabold uppercase tracking-widest">{post.category}</span>
        <h1 className="text-2xl md:text-4xl font-black text-zinc-900 mt-3 leading-tight">{post.title}</h1>

        <div className="flex items-center gap-5 mt-5 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><User size={13} /> {post.author}</span>
          <span className="flex items-center gap-1.5"><Calendar size={13} /> {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-zinc-200 mt-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/900x500/1A1A1A/FFFFFF?text=ElexoPlus"; }}
          />
        </div>

        <div className="prose prose-invert prose-amber max-w-none mt-8">
          <p className="text-zinc-600 text-base leading-relaxed">{post.content}</p>
        </div>

        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-zinc-200">
            <h3 className="text-zinc-900 font-extrabold text-lg mb-6">Related Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((r) => (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="block bg-white border border-zinc-200 rounded-xl p-5 hover:border-amber-400/40 transition-colors">
                  <span className="text-amber-600 text-[11px] font-extrabold uppercase tracking-wider">{r.category}</span>
                  <p className="text-zinc-900 font-bold text-sm mt-2 leading-snug">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
