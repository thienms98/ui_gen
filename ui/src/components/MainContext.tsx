'use client';
import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

interface IMainContext {
  routes: {
    page: string;
    layouts: string[];
  }[];
  currentPage: number;
  previewFS: boolean;
  addLayout: (name: string) => void;
  removeLayout: (index: number) => void;
  swapLayout: (source: number, dest: number) => void;
  addRoute: (route: string) => void;
  removeRoute: (index: number) => void;
  changeRoute: (route: number, layouts: string[]) => void;
  changeCurrentPage: (index: number) => void;
  togglePreview: (val?: boolean) => void;
}

const MainContext = createContext<IMainContext>({
  routes: [],
  currentPage: 0,
  previewFS: false,
  addLayout: () => {},
  removeLayout: () => {},
  swapLayout: () => {},
  addRoute: () => {},
  removeRoute: () => {},
  changeRoute: () => {},
  changeCurrentPage: () => {},
  togglePreview: () => {},
});

export const useMainContext = () => {
  const context = useContext(MainContext);
  return context;
};

export const MainProvider = ({ children }: { children: ReactNode }) => {
  const [routes, setRoutes] = useState<{ page: string; layouts: string[] }[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [previewFS, setPreviewFS] = useState<boolean>(false);
  const addLayout = (layout: string) => {
    setRoutes((prev) => {
      const newRoutes = [...prev];
      newRoutes[currentPage].layouts.push(layout);
      return newRoutes;
    });
  };
  const removeLayout = (index: number) => {
    setRoutes((prev) => {
      const newRoutes = [...prev];
      newRoutes[currentPage].layouts.splice(index, 1);
      return newRoutes;
    });
  };
  const swapLayout = (source: number, dest: number) => {
    const clonedLayout = [...routes[currentPage].layouts];
    const temp = clonedLayout[source];
    clonedLayout[source] = clonedLayout[dest];
    clonedLayout[dest] = temp;

    setRoutes((prev) => {
      const next = [...prev];
      next.splice(currentPage, 1, {
        ...next[currentPage],
        layouts: clonedLayout,
      });
      return next;
    });
  };
  const addRoute = (route: string) => {
    if (!route.trim()) return;
    const page = ('/' + route).replaceAll(/\/+/g, '/');
    if (routes.find((item) => item.page === page)) return;
    setRoutes((prev) => {
      return [
        ...prev,
        {
          page,
          layouts: [],
        },
      ];
    });
  };
  const removeRoute = (index: number) => {
    setRoutes((prev) => prev.filter((r, i) => i !== index));
    fetch('http://localhost:3232/pages', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        page: routes[index].page,
      }),
    });
  };
  const changeRoute = (index: number, layouts: string[]) => {
    setRoutes((prev) => {
      prev.splice(index, 0, { ...prev[index], layouts });
      return prev;
    });
  };
  const changeCurrentPage = (index: number) => {
    if (index < 0 || index > routes.length) return;
    setCurrentPage(index);
  };
  const togglePreview = (val?: boolean) => {
    if (val) setPreviewFS(val);
    else setPreviewFS((prev) => !prev);
  };

  useEffect(() => {
    fetch('http://localhost:3232/pages')
      .then((res) => res.json())
      .then(({ pages }) => setRoutes(pages));
  }, []);
  useEffect(() => {
    const len = routes.length;
    if (currentPage > len - 1) setCurrentPage((len || 1) - 1);
  }, [currentPage, routes.length]);
  useEffect(() => {
    if (routes.length === 0) addRoute('/');
  }, [routes.length]);

  return (
    <MainContext.Provider
      value={{
        routes,
        currentPage,
        previewFS,
        addLayout,
        removeLayout,
        swapLayout,
        addRoute,
        removeRoute,
        changeRoute,
        changeCurrentPage,
        togglePreview,
      }}
    >
      <main className="flex">{children}</main>;
    </MainContext.Provider>
  );
};
