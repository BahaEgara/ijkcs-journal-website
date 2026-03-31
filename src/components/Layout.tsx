import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import PageLoader from "./PageLoader";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    window.scrollTo(0, 0);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {children}
      {isLoading && <PageLoader />}
      <ScrollToTop />
    </>
  );
};

export default Layout;