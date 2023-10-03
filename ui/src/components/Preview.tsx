'use client';

import { useState } from 'react';

export default function Preview() {
  // const { previewFS, togglePreview } = useMainContext();
  const [view, setView] = useState<number>(0); // 0: destop, 1: mobile

  return (
    <div className="w-[700px] shrink-0 px-2 border-l">
      <iframe className="w-full h-screen" src="http://localhost:3011"></iframe>
    </div>
  );
}
