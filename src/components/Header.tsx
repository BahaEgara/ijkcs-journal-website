import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/archives", label: "Archives" },
    { href: "/about", label: "About the Journal" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      {/* Floating Desktop Nav */}
      <div className={`hidden md:block max-w-5xl mx-auto transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="bg-card/95 backdrop-blur-md rounded-full border border-border px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <span className="text-primary-foreground font-bold text-lg">IJ</span>
              </div>
              <div>
                <span className="text-base font-bold font-serif block leading-tight">IJKCS</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium rounded-full px-4 py-2 transition-all duration-300 hover:bg-accent hover:text-accent-foreground ${
                    location.pathname === link.href ? 'bg-accent/20 text-accent' : 'text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted/60 transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-card/95 backdrop-blur-md rounded-2xl border border-border">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-base">IJ</span>
            </div>
            <span className="text-base font-bold font-serif">IJKCS</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted/60 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="px-4 pb-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium rounded-lg px-4 py-3 transition-all ${
                    location.pathname === link.href ? 'bg-accent/20 text-accent' : 'hover:bg-muted/60'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
