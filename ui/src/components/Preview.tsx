'use client';

import { useState } from 'react';
import { useMainContext } from './MainContext';

interface Device {
  key: number;
  name: string;
  width: number;
}

const DEVICES: Device[] = [
  {
    key: 0,
    name: 'Desktop',
    width: 1280,
  },
  {
    key: 1,
    name: 'Mobile',
    width: 512,
  },
];

export default function Preview() {
  const { previewFS, togglePreview } = useMainContext();
  const [view, setView] = useState<number>(0); // 0: destop, 1: mobile

  return previewFS ? (
    <div className="fixed w-screen h-screen shrink-0 border-l top-0 right-0 bg-[#f3f4f6] z-[200] flex flex-col preview">
      <div className="bg-white py-3 shadow-lg">
        <div className="container flex flex-row justify-between mx-auto">
          <div className="cursor-pointer hover:underline" onClick={() => togglePreview(false)}>
            &lt; Back
          </div>
          <div className="flex flex-row">
            {DEVICES.map(({ key, name }) => (
              <span
                key={key}
                className={`cursor-pointer border-r-2 px-3 last:border-none hover:underline ${
                  view === key ? 'underline text-blue-300' : ''
                }`}
                onClick={() => setView(key)}
              >
                {name}
              </span>
            ))}
          </div>
          <div className="cursor-pointer hover:underline">
            <a href="http://localhost:3011" target="_blank">
              Go to page &gt;
            </a>
          </div>
        </div>
      </div>
      <div className="flex-1 mx-auto py-5 transition-all" style={{ width: DEVICES[view].width }}>
        <iframe className="w-full h-full" src="http://localhost:3011"></iframe>
      </div>
    </div>
  ) : (
    <div className="w-[700px] shrink-0 px-2 border-l">
      <iframe className="w-full h-screen" src="http://localhost:3011"></iframe>
    </div>
  );
}
