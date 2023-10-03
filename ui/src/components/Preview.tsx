'use client';

import { useMainContext } from './MainContext';

export default function Preview() {
  const { routes, currentPage } = useMainContext();

  return (
    <div className="w-[700px] shrink-0 px-2 border-l">
      <iframe className="w-full h-screen" src={`http://localhost:3011${routes[currentPage].page || ''}`}></iframe>
    </div>
  );
}
