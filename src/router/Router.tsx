import React, { createContext, useContext, useState, useEffect } from 'react';

export type RoutePath = string;

interface RouterContextType {
  currentPath: RoutePath;
  navigate: (path: RoutePath) => void;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialPath = (): RoutePath => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname || '/';
  };

  const [currentPath, setCurrentPath] = useState<RoutePath>(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname as RoutePath;
      setCurrentPath(path);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: RoutePath) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Link: React.FC<{
  href: RoutePath;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ href, children, className = '', onClick }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
