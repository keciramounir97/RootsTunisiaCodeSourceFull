import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Image as ImageIcon,
  Video,
  Calendar,
  MoreHorizontal,
  Bookmark,
  ThumbsUp,
  Angry,
  Laugh,
  Frown,
  Plus,
  X,
  Globe,
  Users,
  Lock,
  Sparkles,
  BookOpen,
  Filter,
} from "lucide-react";
import { api } from "../api/client";
import { getApiErrorMessage, getApiRoot } from "../api/helpers";
import { useTranslation } from "../context/TranslationContext";
import { useTheme } from "../context/ThemeContext";
import RootsPageShell from "../components/RootsPageShell";
import articleFallbackImage from "../assets/family-archive.jpg";

interface Post {
  id: number | string;
  title?: string;
  category?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  videos?: string[];
  createdAt: string;
  likes?: number;
  comments?: Comment[];
  reactions?: Reaction[];
  isLiked?: boolean;
  isBookmarked?: boolean;
  visibility?: "public" | "community" | "private";
}

interface Comment {
  id: number | string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  likes?: number;
  createdAt: string;
}

interface Reaction {
  type: "like" | "love" | "laugh" | "sad" | "angry";
  count: number;
  isActive?: boolean;
}

const TUNISIAN_INITIAL_ARTICLES: Post[] = [
  {
    id: "tun-art-1",
    title: "Tracing Husainid Beylik Lineages in the Medina of Tunis",
    category: "Archives & Sijillat",
    userId: "tn-archive-dept",
    userName: "Archives Nationales de Tunisie",
    content:
      "A deep exploration into the 18th and 19th century chancery records of Tunis. Learn how majba tax rolls, habous deeds, and beylical decrees provide priceless clues for reconstructing family genealogies across the Medina and suburban mahallas.",
    images: [articleFallbackImage],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    likes: 42,
    comments: [
      {
        id: "c1",
        userId: "u1",
        userName: "Youssef Ben Ammar",
        text: "Incredible research! My family traced our ancestral habous deed back to 1842 in Tunis.",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    reactions: [
      { type: "like", count: 28, isActive: false },
      { type: "love", count: 14, isActive: false },
    ],
    visibility: "public",
  },
  {
    id: "tun-art-2",
    title: "Oral Traditions & Malouf Memory in Kairouan and Testour",
    category: "Oral Memory",
    userId: "tn-heritage-soc",
    userName: "Tunisian Heritage Circle",
    content:
      "Oral memory preserves what written registers sometimes miss. Discover how Andalusian descendants in Testour and Kairouan keep family pedigree songs and oral waqf stories alive through generations.",
    images: [],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    likes: 31,
    comments: [],
    reactions: [{ type: "love", count: 31, isActive: false }],
    visibility: "community",
  },
];

const formatTimeAgo = (dateString: string, t: (key: string, fallback?: string) => string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}${t("minutes_ago_suffix", "m ago")}`;
  if (hours < 24) return `${hours}${t("hours_ago_suffix", "h ago")}`;
  if (days < 7) return `${days}${t("days_ago_suffix", "d ago")}`;
  return date.toLocaleDateString();
};

export default function GalleryArticles() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const apiRoot = useMemo(() => getApiRoot(), []);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Genealogy");
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [newPostImageInput, setNewPostImageInput] = useState("");
  const [newPostVisibility, setNewPostVisibility] = useState<"public" | "community" | "private">("public");
  const [postError, setPostError] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activePostId, setActivePostId] = useState<number | string | null>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/articles");
        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.articles)
          ? data.articles
          : Array.isArray(data)
          ? data
          : [];
        if (items.length > 0) {
          setPosts(items);
        } else {
          setPosts(TUNISIAN_INITIAL_ARTICLES);
        }
      } catch {
        setPosts(TUNISIAN_INITIAL_ARTICLES);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiRoot, t]);

  const categories = ["All", "Archives & Sijillat", "Oral Memory", "Genealogy", "Civil Register", "Landmarks"];

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") return posts;
    return posts.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [posts, selectedCategory]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setPostError("");

    try {
      setPosting(true);
      const payload = {
        title: newPostTitle.trim() || newPostContent.trim().slice(0, 70),
        category: newPostCategory.trim(),
        content: newPostContent.trim(),
        images: newPostImages,
        visibility: newPostVisibility,
      };
      const { data } = await api.post("/my/articles", payload);
      const newCreated: Post = {
        id: data?.data?.id || Date.now(),
        title: payload.title,
        category: payload.category,
        userId: "curUser",
        userName: t("you", "You"),
        content: payload.content,
        images: payload.images,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        reactions: [{ type: "like", count: 0, isActive: false }],
        visibility: payload.visibility,
      };
      setPosts((prev) => [newCreated, ...prev]);
      setNewPostContent("");
      setNewPostTitle("");
      setNewPostImages([]);
      setShowCreatePost(false);
    } catch (err) {
      // Offline or error fallback
      const fallbackPost: Post = {
        id: Date.now(),
        title: newPostTitle.trim() || newPostContent.trim().slice(0, 70),
        category: newPostCategory.trim(),
        userId: "curUser",
        userName: t("you", "You"),
        content: newPostContent.trim(),
        images: newPostImages,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        visibility: newPostVisibility,
      };
      setPosts((prev) => [fallbackPost, ...prev]);
      setNewPostContent("");
      setNewPostTitle("");
      setNewPostImages([]);
      setShowCreatePost(false);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = (postId: number | string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? (post.likes || 0) - 1 : (post.likes || 0) + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: number | string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      userId: "currentUser",
      userName: t("you", "You"),
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments || []), comment] }
          : post
      )
    );

    setNewComment("");
  };

  return (
    <RootsPageShell
      hero={
        <div className="space-y-4 text-center">
          <p className="eyebrow text-[var(--gold)] text-shadow-gold tracking-widest font-bold">
            {t("community", "Roots Tunisia Community")}
          </p>
          <h1 className="display-xl text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">
            {t("articles_feed", "Tunisian Genealogical Articles & Stories")}
          </h1>
          <div className="gold-rule mt-4 w-28 mx-auto shadow-lg" />
          <p className="max-w-3xl mx-auto text-base text-slate-100/95 font-medium drop-shadow-md">
            {t(
              "articles_intro",
              "Explore research insights, oral memories, beylical register analyses, and heritage stories from across the 24 governorates of Tunisia.",
            )}
          </p>
        </div>
      }
    >
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border)]">
          <Filter className="w-4 h-4 text-[var(--gold)] shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Create Post Prompt */}
        <div className="surface-card p-5 frame-gold rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--gold)] flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <button
              onClick={() => setShowCreatePost(!showCreatePost)}
              className="flex-1 px-4 py-3 rounded-md text-start text-xs font-semibold bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)] transition-all cursor-pointer"
            >
              {t("share_story", "Share a Tunisian family story, archive finding, or photo record…")}
            </button>
          </div>

          {showCreatePost && (
            <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
              <input
                type="text"
                placeholder={t("article_title_placeholder", "Article Title (e.g. My Ancestors in Kairouan)")}
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
              <textarea
                rows={4}
                placeholder={t("articles_compose_hint", "Write your story or research note here...")}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="btn-base btn-outline-ink text-xs px-4 py-2 cursor-pointer"
                  >
                    {t("cancel", "Cancel")}
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={posting || !newPostContent.trim()}
                    className="btn-base btn-gold text-xs px-5 py-2 cursor-pointer"
                  >
                    {posting ? t("sending", "Posting…") : t("publish", "Publish Article")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <article key={post.id} className="surface-card p-6 frame-gold rounded-lg shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--gold)] flex items-center justify-center text-white font-bold text-sm">
                      {post.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--foreground)]">{post.userName}</h4>
                      <p className="text-[0.7rem] text-[var(--muted-foreground)] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[var(--gold)]" />
                        {formatTimeAgo(post.createdAt, t)}
                      </p>
                    </div>
                  </div>
                  {post.category && (
                    <span className="px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                      {post.category}
                    </span>
                  )}
                </div>

                {post.title && (
                  <h3 className="text-xl font-serif font-bold text-[var(--foreground)]">{post.title}</h3>
                )}

                <p className="text-sm text-[var(--foreground)]/90 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {post.images && post.images.length > 0 && (
                  <div className="overflow-hidden rounded-md border border-[var(--border)] max-h-96">
                    <img src={post.images[0]} alt={post.title || "Article visual"} className="w-full object-cover" />
                  </div>
                )}

                {/* Actions & Comments */}
                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                        post.isLiked ? "text-[var(--primary)]" : "hover:text-[var(--gold)]"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                      <span>{post.likes || 0}</span>
                    </button>

                    <button
                      onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 font-bold hover:text-[var(--gold)] transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: post.title, text: post.content, url: window.location.href });
                      }
                    }}
                    className="flex items-center gap-1 hover:text-[var(--gold)] transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{t("share", "Share")}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {activePostId === post.id && (
                  <div className="pt-4 space-y-3 border-t border-[var(--border)] bg-[var(--background)]/50 p-4 rounded-md">
                    <div className="space-y-2">
                      {post.comments?.map((c) => (
                        <div key={c.id} className="text-xs p-2.5 rounded-sm bg-[var(--card)] border border-[var(--border)] space-y-1">
                          <div className="flex justify-between font-bold text-[var(--foreground)]">
                            <span>{c.userName}</span>
                            <span className="text-[0.65rem] text-[var(--muted-foreground)]">
                              {formatTimeAgo(c.createdAt, t)}
                            </span>
                          </div>
                          <p className="text-[var(--foreground)]/80">{c.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder={t("write_comment", "Write a comment…")}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleComment(post.id)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        className="px-3 py-1.5 text-xs font-bold rounded-sm bg-[var(--primary)] text-white hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </RootsPageShell>
  );
}
