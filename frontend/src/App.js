import React, { useState, useEffect, createContext, useContext } from "react";
import "@/index.css";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  Menu, X, ChefHat, Clock, Users, Search, ArrowRight, 
  Instagram, Facebook, Youtube, Mail, Phone, MapPin,
  Home as HomeIcon, BookOpen, Utensils, Leaf, CookingPot, FileText,
  User, LogOut, Plus, Edit, Trash2, Save, ArrowLeft
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUser(res.data);
      }).catch(() => {
        localStorage.removeItem("token");
        setToken(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// API Helper
const api = {
  get: (url) => axios.get(`${API}${url}`),
  post: (url, data, token) => axios.post(`${API}${url}`, data, { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
  }),
  put: (url, data, token) => axios.put(`${API}${url}`, data, { 
    headers: { Authorization: `Bearer ${token}` } 
  }),
  delete: (url, token) => axios.delete(`${API}${url}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  }),
};

// ============== COMPONENTS ==============

// Navigation
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Startseite", icon: HomeIcon },
    { to: "/rezepte", label: "Rezepte", icon: Utensils },
    { to: "/afghanische-esskultur", label: "Esskultur", icon: BookOpen },
    { to: "/blog", label: "Blog", icon: FileText },
  ];

  return (
    <nav 
      data-testid="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-soft py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            data-testid="logo-link"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold text-pine group-hover:text-saffron transition-colors">
              AfghanFood<span className="text-saffron">.de</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                data-testid={`nav-${link.label.toLowerCase()}`}
                className={`font-medium transition-colors ${
                  location.pathname === link.to 
                    ? "text-saffron" 
                    : "text-pine hover:text-saffron"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/admin" 
                  data-testid="admin-link"
                  className="btn-secondary text-sm py-2"
                >
                  Admin
                </Link>
                <button 
                  onClick={logout}
                  data-testid="logout-btn"
                  className="text-pine hover:text-pomegranate transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                data-testid="login-link"
                className="text-pine hover:text-saffron font-medium"
              >
                Anmelden
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-pine"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div 
            data-testid="mobile-menu"
            className="lg:hidden mt-4 pb-4 animate-fade-in"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    location.pathname === link.to 
                      ? "bg-saffron/10 text-saffron" 
                      : "hover:bg-pine/5 text-pine"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-saffron/20 pt-4 mt-2">
                {user ? (
                  <>
                    <Link 
                      to="/admin" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 text-pine hover:bg-pine/5 rounded-xl"
                    >
                      <User className="w-5 h-5" />
                      Admin-Bereich
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="flex items-center gap-3 p-3 text-pomegranate hover:bg-pomegranate/5 rounded-xl w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      Abmelden
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 text-pine hover:bg-pine/5 rounded-xl"
                  >
                    <User className="w-5 h-5" />
                    Anmelden
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Footer
const Footer = () => (
  <footer data-testid="footer" className="bg-pine text-creme mt-20">
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold text-creme">
              AfghanFood<span className="text-saffron">.de</span>
            </span>
          </Link>
          <p className="text-creme/70 leading-relaxed">
            Entdecken Sie die Vielfalt der afghanischen Küche - authentische Rezepte, 
            kulturelle Einblicke und kulinarische Inspiration.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-serif text-lg font-semibold mb-4 text-saffron">Navigation</h4>
          <ul className="space-y-2">
            <li><Link to="/rezepte" className="text-creme/70 hover:text-saffron transition-colors">Rezepte</Link></li>
            <li><Link to="/afghanische-esskultur" className="text-creme/70 hover:text-saffron transition-colors">Afghanische Esskultur</Link></li>
            <li><Link to="/zutaten-gewuerze" className="text-creme/70 hover:text-saffron transition-colors">Zutaten & Gewürze</Link></li>
            <li><Link to="/kuechenhelfer" className="text-creme/70 hover:text-saffron transition-colors">Küchenhelfer</Link></li>
            <li><Link to="/blog" className="text-creme/70 hover:text-saffron transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-serif text-lg font-semibold mb-4 text-saffron">Informationen</h4>
          <ul className="space-y-2">
            <li><Link to="/ueber-uns" className="text-creme/70 hover:text-saffron transition-colors">Über uns</Link></li>
            <li><Link to="/impressum" className="text-creme/70 hover:text-saffron transition-colors">Impressum</Link></li>
            <li><Link to="/datenschutz" className="text-creme/70 hover:text-saffron transition-colors">Datenschutz</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-serif text-lg font-semibold mb-4 text-saffron">Kontakt</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-creme/70">
              <Mail className="w-5 h-5 text-saffron" />
              info@afghanfood.de
            </li>
            <li className="flex items-center gap-3 text-creme/70">
              <MapPin className="w-5 h-5 text-saffron" />
              Deutschland
            </li>
          </ul>
          <div className="flex gap-4 mt-6">
            <a href="#" className="w-10 h-10 bg-creme/10 rounded-full flex items-center justify-center hover:bg-saffron transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-creme/10 rounded-full flex items-center justify-center hover:bg-saffron transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-creme/10 rounded-full flex items-center justify-center hover:bg-saffron transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-creme/10 mt-12 pt-8 text-center text-creme/50">
        <p>© {new Date().getFullYear()} AfghanFood.de – Mit Liebe für die afghanische Küche</p>
      </div>
    </div>
  </footer>
);

// Layout Wrapper
const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow pt-24">
      {children}
    </main>
    <Footer />
  </div>
);

// Recipe Card
const RecipeCard = ({ recipe, featured = false }) => (
  <Link 
    to={`/rezepte/${recipe.slug}`}
    data-testid={`recipe-card-${recipe.slug}`}
    className={`group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 ${
      featured ? "md:col-span-2 md:row-span-2" : ""
    }`}
  >
    <div className={`relative overflow-hidden ${featured ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
      <img 
        src={recipe.image_url} 
        alt={recipe.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute top-4 left-4">
        <span className={`badge ${
          recipe.difficulty === "Einfach" ? "difficulty-easy" :
          recipe.difficulty === "Mittel" ? "difficulty-medium" : "difficulty-hard"
        }`}>
          {recipe.difficulty}
        </span>
      </div>
    </div>
    <div className="p-5">
      <h3 className={`font-serif font-semibold text-pine group-hover:text-saffron transition-colors ${
        featured ? "text-2xl mb-3" : "text-xl mb-2"
      }`}>
        {recipe.title}
      </h3>
      <p className="text-pine/60 text-sm line-clamp-2 mb-4">{recipe.description}</p>
      <div className="flex items-center gap-4 text-sm text-pine/50">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {recipe.cook_time}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {recipe.servings} Portionen
        </span>
      </div>
    </div>
  </Link>
);

// Blog Card
const BlogCard = ({ post, featured = false }) => (
  <Link 
    to={`/blog/${post.slug}`}
    data-testid={`blog-card-${post.slug}`}
    className={`group block ${featured ? "" : "flex gap-4"}`}
  >
    <div className={`relative overflow-hidden rounded-xl ${featured ? "aspect-[16/9] mb-4" : "w-24 h-24 flex-shrink-0"}`}>
      <img 
        src={post.image_url} 
        alt={post.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>
    <div className={featured ? "" : "flex-grow"}>
      <span className="badge badge-saffron mb-2">{post.category}</span>
      <h3 className={`font-serif font-semibold text-pine group-hover:text-saffron transition-colors ${
        featured ? "text-2xl mb-2" : "text-base mb-1"
      }`}>
        {post.title}
      </h3>
      {featured && <p className="text-pine/60 line-clamp-2">{post.excerpt}</p>}
    </div>
  </Link>
);

// ============== PAGES ==============

// Home Page
const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/recipes?limit=4"),
      api.get("/blog?limit=3")
    ]).then(([recipesRes, blogRes]) => {
      setRecipes(recipesRes.data);
      setBlogPosts(blogRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1634324092526-91f5e878b72f?w=1600&q=80"
            alt="Afghanisches Essen"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pine/90 via-pine/70 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-2xl animate-slide-up">
            <span className="font-accent text-saffron text-2xl mb-4 block">
              Authentische Küche aus Afghanistan
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Willkommen bei<br />
              <span className="text-saffron">AfghanFood.de</span>
            </h1>
            <p className="text-xl text-creme/90 mb-8 leading-relaxed">
              Entdecken Sie die Vielfalt und den Reichtum der afghanischen Küche. 
              AfghanFood.de verbindet authentische Rezepte, traditionelle Gerichte und 
              spannende Einblicke in die afghanische Esskultur.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/rezepte" 
                data-testid="hero-recipes-btn"
                className="btn-primary"
              >
                Rezepte entdecken
              </Link>
              <Link 
                to="/afghanische-esskultur" 
                data-testid="hero-culture-btn"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-serif text-lg transition-colors backdrop-blur-sm"
              >
                Afghanische Esskultur
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-warm-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-accent text-saffron text-2xl">Eine kulinarische Reise</span>
            <h2 className="font-serif text-3xl md:text-4xl text-pine mt-2 mb-6">
              Kochen ist Liebe, die man schmecken kann
            </h2>
            <p className="text-pine/70 text-lg leading-relaxed">
              Die afghanische Küche ist geprägt von Gastfreundschaft, Tradition und den 
              vielfältigen Einflüssen der Seidenstraße. Jedes Gericht erzählt eine Geschichte 
              von Gemeinschaft und Genuss. Lassen Sie sich von unseren Rezepten inspirieren 
              und entdecken Sie die Aromen Afghanistans in Ihrer eigenen Küche.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Recipes */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="font-accent text-saffron text-2xl">Frisch aus der Küche</span>
              <h2 className="font-serif text-3xl md:text-4xl text-pine mt-2">
                Neueste Rezepte
              </h2>
            </div>
            <Link 
              to="/rezepte" 
              data-testid="view-all-recipes"
              className="hidden md:flex items-center gap-2 text-pine hover:text-saffron font-medium transition-colors"
            >
              Alle Rezepte
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-creme-dark" />
                  <div className="p-5">
                    <div className="h-6 bg-creme-dark rounded w-3/4 mb-2" />
                    <div className="h-4 bg-creme-dark rounded w-full mb-2" />
                    <div className="h-4 bg-creme-dark rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, idx) => (
                <RecipeCard key={recipe.id} recipe={recipe} featured={idx === 0} />
              ))}
            </div>
          )}

          <Link 
            to="/rezepte" 
            className="md:hidden flex items-center justify-center gap-2 mt-8 text-pine hover:text-saffron font-medium transition-colors"
          >
            Alle Rezepte ansehen
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-pine">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/afghanische-esskultur" className="group p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
              <BookOpen className="w-12 h-12 text-saffron mb-4" />
              <h3 className="font-serif text-2xl text-creme mb-2 group-hover:text-saffron transition-colors">
                Afghanische Esskultur
              </h3>
              <p className="text-creme/70">
                Erfahren Sie mehr über die Traditionen und Bräuche der afghanischen Küche.
              </p>
            </Link>
            <Link to="/zutaten-gewuerze" className="group p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
              <Leaf className="w-12 h-12 text-saffron mb-4" />
              <h3 className="font-serif text-2xl text-creme mb-2 group-hover:text-saffron transition-colors">
                Zutaten & Gewürze
              </h3>
              <p className="text-creme/70">
                Die wichtigsten Zutaten und aromatischen Gewürze der afghanischen Küche.
              </p>
            </Link>
            <Link to="/kuechenhelfer" className="group p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
              <CookingPot className="w-12 h-12 text-saffron mb-4" />
              <h3 className="font-serif text-2xl text-creme mb-2 group-hover:text-saffron transition-colors">
                Küchenhelfer
              </h3>
              <p className="text-creme/70">
                Die richtigen Werkzeuge für authentische afghanische Gerichte.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      {blogPosts.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="font-accent text-saffron text-2xl">Neuigkeiten</span>
                <h2 className="font-serif text-3xl md:text-4xl text-pine mt-2">
                  Aus dem Blog
                </h2>
              </div>
              <Link 
                to="/blog" 
                data-testid="view-all-blog"
                className="hidden md:flex items-center gap-2 text-pine hover:text-saffron font-medium transition-colors"
              >
                Alle Artikel
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {blogPosts[0] && <BlogCard post={blogPosts[0]} featured />}
              <div className="space-y-6">
                {blogPosts.slice(1).map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// Recipes List Page
const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/recipes"),
      api.get("/categories")
    ]).then(([recipesRes, categoriesRes]) => {
      setRecipes(recipesRes.data);
      setCategories(categoriesRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filteredRecipes = selectedCategory 
    ? recipes.filter(r => r.category === selectedCategory)
    : recipes;

  return (
    <div data-testid="recipes-page" className="container mx-auto px-4 lg:px-8 py-12">
      <div className="max-w-3xl mb-12">
        <span className="font-accent text-saffron text-2xl">Unsere Sammlung</span>
        <h1 className="font-serif text-4xl md:text-5xl text-pine mt-2 mb-4">
          Afghanische Rezepte
        </h1>
        <p className="text-pine/70 text-lg">
          Von traditionellen Hauptgerichten bis zu süßen Desserts – entdecken Sie 
          die Vielfalt der afghanischen Küche.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-10">
        <button
          data-testid="category-all"
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            !selectedCategory 
              ? "bg-saffron text-white" 
              : "bg-pine/5 text-pine hover:bg-pine/10"
          }`}
        >
          Alle Rezepte
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            data-testid={`category-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === cat.id 
                ? "bg-saffron text-white" 
                : "bg-pine/5 text-pine hover:bg-pine/10"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-creme-dark" />
              <div className="p-5">
                <div className="h-6 bg-creme-dark rounded w-3/4 mb-2" />
                <div className="h-4 bg-creme-dark rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {!loading && filteredRecipes.length === 0 && (
        <div className="text-center py-16">
          <Utensils className="w-16 h-16 text-pine/20 mx-auto mb-4" />
          <p className="text-pine/60 text-lg">Keine Rezepte in dieser Kategorie gefunden.</p>
        </div>
      )}
    </div>
  );
};

// Recipe Detail Page
const RecipeDetailPage = () => {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/recipes/${slug}`)
      .then(res => setRecipe(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-96 bg-creme-dark rounded-2xl mb-8" />
          <div className="h-10 bg-creme-dark rounded w-1/2 mb-4" />
          <div className="h-6 bg-creme-dark rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12 text-center">
        <h1 className="font-serif text-3xl text-pine mb-4">Rezept nicht gefunden</h1>
        <Link to="/rezepte" className="text-saffron hover:underline">Zurück zu den Rezepten</Link>
      </div>
    );
  }

  return (
    <article data-testid="recipe-detail-page" className="pb-12">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img 
          src={recipe.image_url} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pine/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 lg:px-8 pb-8">
          <span className={`badge mb-4 ${
            recipe.difficulty === "Einfach" ? "difficulty-easy" :
            recipe.difficulty === "Mittel" ? "difficulty-medium" : "difficulty-hard"
          }`}>
            {recipe.difficulty}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">{recipe.title}</h1>
          <div className="flex flex-wrap gap-6 text-creme/90">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-saffron" />
              Zubereitung: {recipe.prep_time}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-saffron" />
              Kochzeit: {recipe.cook_time}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-saffron" />
              {recipe.servings} Portionen
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Ingredients Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-28">
              <h2 className="font-serif text-2xl text-pine mb-6 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-saffron" />
                Zutaten
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between py-2 border-b border-creme last:border-0">
                    <span className="text-pine">{ing.name}</span>
                    <span className="text-pine/60 font-medium">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <p className="text-lg text-pine/80 mb-8 leading-relaxed">{recipe.description}</p>

            <h2 className="font-serif text-2xl text-pine mb-6 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-saffron" />
              Zubereitung
            </h2>
            <ol className="space-y-6">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-saffron text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-pine/80 leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>

            {recipe.tips && (
              <div className="mt-10 p-6 bg-saffron/10 rounded-2xl border border-saffron/20">
                <h3 className="font-accent text-2xl text-saffron mb-2">Tipp vom Koch</h3>
                <p className="text-pine/80">{recipe.tips}</p>
              </div>
            )}

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {recipe.tags.map(tag => (
                  <span key={tag} className="badge badge-pine">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

// Blog List Page
const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/blog").then(res => setPosts(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="blog-page" className="container mx-auto px-4 lg:px-8 py-12">
      <div className="max-w-3xl mb-12">
        <span className="font-accent text-saffron text-2xl">Geschichten & Wissen</span>
        <h1 className="font-serif text-4xl md:text-5xl text-pine mt-2 mb-4">Blog</h1>
        <p className="text-pine/70 text-lg">
          Artikel über afghanische Kultur, Traditionen und kulinarische Einblicke.
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[16/9] bg-creme-dark rounded-xl mb-4" />
              <div className="h-6 bg-creme-dark rounded w-3/4 mb-2" />
              <div className="h-4 bg-creme-dark rounded w-full" />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} featured />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-pine/20 mx-auto mb-4" />
          <p className="text-pine/60 text-lg">Noch keine Blog-Artikel vorhanden.</p>
        </div>
      )}
    </div>
  );
};

// Blog Detail Page
const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blog/${slug}`).then(res => setPost(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="animate-pulse max-w-3xl mx-auto">
          <div className="h-64 bg-creme-dark rounded-2xl mb-8" />
          <div className="h-10 bg-creme-dark rounded w-3/4 mb-4" />
          <div className="h-6 bg-creme-dark rounded w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12 text-center">
        <h1 className="font-serif text-3xl text-pine mb-4">Artikel nicht gefunden</h1>
        <Link to="/blog" className="text-saffron hover:underline">Zurück zum Blog</Link>
      </div>
    );
  }

  return (
    <article data-testid="blog-detail-page" className="py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-pine hover:text-saffron mb-8">
            <ArrowLeft className="w-4 h-4" />
            Zurück zum Blog
          </Link>

          <span className="badge badge-saffron mb-4">{post.category}</span>
          <h1 className="font-serif text-4xl md:text-5xl text-pine mb-6">{post.title}</h1>
          
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full aspect-[16/9] object-cover rounded-2xl mb-8"
          />

          <div className="markdown-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>').replace(/^# (.*$)/gim, '<h1>$1</h1>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>').replace(/^\- (.*$)/gim, '<li>$1</li>') }} />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-creme flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="badge badge-pine">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

// Static Content Page
const ContentPage = ({ slug }) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/pages/${slug}`).then(res => setPage(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="animate-pulse max-w-3xl">
          <div className="h-10 bg-creme-dark rounded w-1/2 mb-6" />
          <div className="space-y-3">
            <div className="h-4 bg-creme-dark rounded w-full" />
            <div className="h-4 bg-creme-dark rounded w-full" />
            <div className="h-4 bg-creme-dark rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12 text-center">
        <h1 className="font-serif text-3xl text-pine mb-4">Seite nicht gefunden</h1>
        <Link to="/" className="text-saffron hover:underline">Zurück zur Startseite</Link>
      </div>
    );
  }

  return (
    <div data-testid={`page-${slug}`} className="container mx-auto px-4 lg:px-8 py-12">
      <div className="max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-pine mb-8">{page.title}</h1>
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, '<br/>').replace(/^# (.*$)/gim, '<h1>$1</h1>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>').replace(/^\- (.*$)/gim, '<li>$1</li>') }} />
      </div>
    </div>
  );
};

// Login Page
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/admin");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.detail || "Anmeldung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="login-page" className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-saffron rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl text-pine">Admin-Anmeldung</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-card">
          {error && (
            <div className="mb-4 p-3 bg-pomegranate/10 border border-pomegranate/20 rounded-lg text-pomegranate text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-pine font-medium mb-2">E-Mail</label>
            <input
              type="email"
              data-testid="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-creme focus:border-saffron focus:ring-2 focus:ring-saffron/20 outline-none"
              placeholder="admin@afghanfood.de"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-pine font-medium mb-2">Passwort</label>
            <input
              type="password"
              data-testid="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-creme focus:border-saffron focus:ring-2 focus:ring-saffron/20 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            data-testid="login-submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? "Wird angemeldet..." : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadRecipes();
  }, [user, navigate]);

  const loadRecipes = () => {
    api.get("/recipes").then(res => setRecipes(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Möchten Sie dieses Rezept wirklich löschen?")) return;
    try {
      await api.delete(`/recipes/${id}`, token);
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (err) {
      alert("Fehler beim Löschen");
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingRecipe(null);
    setShowForm(true);
  };

  const handleSave = async (recipeData) => {
    try {
      if (editingRecipe) {
        await api.put(`/recipes/${editingRecipe.id}`, recipeData, token);
      } else {
        await api.post("/recipes", recipeData, token);
      }
      setShowForm(false);
      setEditingRecipe(null);
      loadRecipes();
    } catch (err) {
      alert(err.response?.data?.detail || "Fehler beim Speichern");
    }
  };

  if (!user) return null;

  return (
    <div data-testid="admin-dashboard" className="container mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-pine">Admin-Bereich</h1>
          <p className="text-pine/60">Willkommen, {user.name}</p>
        </div>
        <button
          data-testid="new-recipe-btn"
          onClick={handleNew}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Neues Rezept
        </button>
      </div>

      {showForm ? (
        <RecipeForm 
          recipe={editingRecipe} 
          onSave={handleSave} 
          onCancel={() => { setShowForm(false); setEditingRecipe(null); }} 
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-creme">
              <tr>
                <th className="text-left p-4 font-medium text-pine">Rezept</th>
                <th className="text-left p-4 font-medium text-pine hidden md:table-cell">Kategorie</th>
                <th className="text-left p-4 font-medium text-pine hidden md:table-cell">Schwierigkeit</th>
                <th className="text-right p-4 font-medium text-pine">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-pine/60">Laden...</td></tr>
              ) : recipes.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-pine/60">Keine Rezepte vorhanden</td></tr>
              ) : recipes.map(recipe => (
                <tr key={recipe.id} className="border-t border-creme hover:bg-creme/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={recipe.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="font-medium text-pine">{recipe.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-pine/70 hidden md:table-cell">{recipe.category}</td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`badge ${
                      recipe.difficulty === "Einfach" ? "difficulty-easy" :
                      recipe.difficulty === "Mittel" ? "difficulty-medium" : "difficulty-hard"
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        data-testid={`edit-recipe-${recipe.id}`}
                        onClick={() => handleEdit(recipe)}
                        className="p-2 text-pine hover:text-saffron transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        data-testid={`delete-recipe-${recipe.id}`}
                        onClick={() => handleDelete(recipe.id)}
                        className="p-2 text-pine hover:text-pomegranate transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Recipe Form Component
const RecipeForm = ({ recipe, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: recipe?.title || "",
    slug: recipe?.slug || "",
    description: recipe?.description || "",
    image_url: recipe?.image_url || "",
    category: recipe?.category || "hauptgerichte",
    difficulty: recipe?.difficulty || "Mittel",
    prep_time: recipe?.prep_time || "",
    cook_time: recipe?.cook_time || "",
    servings: recipe?.servings || 4,
    ingredients: recipe?.ingredients || [{ name: "", amount: "" }],
    instructions: recipe?.instructions || [""],
    tips: recipe?.tips || "",
    tags: recipe?.tags || []
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (idx, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[idx] = { ...newIngredients[idx], [field]: value };
    handleChange("ingredients", newIngredients);
  };

  const addIngredient = () => {
    handleChange("ingredients", [...formData.ingredients, { name: "", amount: "" }]);
  };

  const removeIngredient = (idx) => {
    handleChange("ingredients", formData.ingredients.filter((_, i) => i !== idx));
  };

  const handleInstructionChange = (idx, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[idx] = value;
    handleChange("instructions", newInstructions);
  };

  const addInstruction = () => {
    handleChange("instructions", [...formData.instructions, ""]);
  };

  const removeInstruction = (idx) => {
    handleChange("instructions", formData.instructions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form data-testid="recipe-form" onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-pine">
          {recipe ? "Rezept bearbeiten" : "Neues Rezept"}
        </h2>
        <button type="button" onClick={onCancel} className="text-pine hover:text-pomegranate">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-pine font-medium mb-2">Titel *</label>
          <input
            type="text"
            data-testid="recipe-title-input"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-creme focus:border-saffron outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-pine font-medium mb-2">Slug (URL) *</label>
          <input
            type="text"
            data-testid="recipe-slug-input"
            value={formData.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-creme focus:border-saffron outline-none"
            placeholder="rezept-name"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-pine font-medium mb-2">Beschreibung *</label>
        <textarea
          data-testid="recipe-description-input"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-creme focus:border-saffron outline-none h-24"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block text-pine font-medium mb-2">Bild-URL *</label>
        <input
          type="url"
          data-testid="recipe-image-input"
          value={formData.image_url}
          onChange={(e) => handleChange("image_url", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-creme focus:border-saffron outline-none"
          required
        />
      </div>

      <div className="grid md:grid-cols-4 gap-4 mt-4">
        <div>
          <label className="block text-pine font-medium mb-2">Kategorie</label>
          <select
            data-testid="recipe-category-select"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-creme focus:border-saffron outline-none"
          >
            <option value="hauptgerichte">Hauptgerichte</option>
            <option value="vorspeisen">Vorspeisen</option>
            <option value="beilagen">Beilagen</option>
            <option value="suppen">Suppen</option>
            <option value="desserts">Desserts</option>
            <option value="getraenke">Getränke</option>
          </select>
        </div>
        <div>
          <label className="block text-pine font-medium mb-2">Schwierigkeit</label>
          <select
            data-testid="recipe-difficulty-select"
            value={formData.difficulty}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-creme focus:border-saffron outline-none"
          >
            <option value="Einfach">Einfach</option>
            <option value="Mittel">Mittel</option>
            <option value="Schwer">Schwer</option>
          </select>
        </div>
        <div>
          <label className="block text-pine font-medium mb-2">Vorbereitungszeit</label>
          <input
            type="text"
            value={formData.prep_time}
            onChange={(e) => handleChange("prep_time", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-creme focus:border-saffron outline-none"
            placeholder="30 Minuten"
          />
        </div>
        <div>
          <label className="block text-pine font-medium mb-2">Kochzeit</label>
          <input
            type="text"
            value={formData.cook_time}
            onChange={(e) => handleChange("cook_time", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-creme focus:border-saffron outline-none"
            placeholder="1 Stunde"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-pine font-medium mb-2">Portionen</label>
        <input
          type="number"
          value={formData.servings}
          onChange={(e) => handleChange("servings", parseInt(e.target.value))}
          className="w-24 px-4 py-3 rounded-lg border border-creme focus:border-saffron outline-none"
          min="1"
        />
      </div>

      {/* Ingredients */}
      <div className="mt-6">
        <label className="block text-pine font-medium mb-2">Zutaten</label>
        {formData.ingredients.map((ing, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              value={ing.name}
              onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
              placeholder="Zutat"
              className="flex-grow px-4 py-2 rounded-lg border border-creme focus:border-saffron outline-none"
            />
            <input
              type="text"
              value={ing.amount}
              onChange={(e) => handleIngredientChange(idx, "amount", e.target.value)}
              placeholder="Menge"
              className="w-32 px-4 py-2 rounded-lg border border-creme focus:border-saffron outline-none"
            />
            <button type="button" onClick={() => removeIngredient(idx)} className="p-2 text-pomegranate">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={addIngredient} className="text-saffron font-medium flex items-center gap-1 mt-2">
          <Plus className="w-4 h-4" /> Zutat hinzufügen
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6">
        <label className="block text-pine font-medium mb-2">Zubereitungsschritte</label>
        {formData.instructions.map((step, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <span className="w-8 h-10 bg-saffron text-white rounded flex items-center justify-center flex-shrink-0">
              {idx + 1}
            </span>
            <textarea
              value={step}
              onChange={(e) => handleInstructionChange(idx, e.target.value)}
              placeholder="Schritt beschreiben..."
              className="flex-grow px-4 py-2 rounded-lg border border-creme focus:border-saffron outline-none"
              rows="2"
            />
            <button type="button" onClick={() => removeInstruction(idx)} className="p-2 text-pomegranate">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={addInstruction} className="text-saffron font-medium flex items-center gap-1 mt-2">
          <Plus className="w-4 h-4" /> Schritt hinzufügen
        </button>
      </div>

      <div className="mt-6">
        <label className="block text-pine font-medium mb-2">Tipp (optional)</label>
        <textarea
          value={formData.tips}
          onChange={(e) => handleChange("tips", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-creme focus:border-saffron outline-none h-20"
          placeholder="Geheimtipp vom Koch..."
        />
      </div>

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-creme">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Abbrechen
        </button>
        <button type="submit" data-testid="save-recipe-btn" className="btn-primary flex items-center gap-2">
          <Save className="w-5 h-5" />
          Speichern
        </button>
      </div>
    </form>
  );
};

// ============== MAIN APP ==============

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/rezepte" element={<Layout><RecipesPage /></Layout>} />
          <Route path="/rezepte/:slug" element={<Layout><RecipeDetailPage /></Layout>} />
          <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogDetailPage /></Layout>} />
          <Route path="/afghanische-esskultur" element={<Layout><ContentPage slug="afghanische-esskultur" /></Layout>} />
          <Route path="/zutaten-gewuerze" element={<Layout><ContentPage slug="zutaten-gewuerze" /></Layout>} />
          <Route path="/kuechenhelfer" element={<Layout><ContentPage slug="kuechenhelfer" /></Layout>} />
          <Route path="/ueber-uns" element={<Layout><ContentPage slug="ueber-uns" /></Layout>} />
          <Route path="/impressum" element={<Layout><ContentPage slug="impressum" /></Layout>} />
          <Route path="/datenschutz" element={<Layout><ContentPage slug="datenschutz" /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
