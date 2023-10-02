import Content from '@/components/Content';
import { MainProvider } from '@/components/MainContext';
import Preview from '@/components/Preview';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Image from 'next/image';

export interface ILayoutGroup {
  [key: string]: string[];
}

async function getData() {
  const res = await fetch('http://localhost:3232/layouts');

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = (await res.json()) as { tailwindLayouts: string[] };
  const layouts: ILayoutGroup = {};

  data.tailwindLayouts.forEach((layout) => {
    const componentName = layout.replace(/\d+/, '');
    if (!layouts[componentName]) {
      layouts[componentName] = [];
    }
    layouts[componentName].push(layout);
  });

  return layouts;
}

export default async function Home() {
  const layouts = await getData();

  return (
    <div id="wrapper" className="h-screen overflow-hidden">
      <MainProvider>
        <Sidebar layouts={layouts} />
        <div className="flex flex-col flex-1">
          <Header />
          <div className="flex flex-row">
            <Content />
            <Preview />
          </div>
        </div>
      </MainProvider>
    </div>
  );
}
