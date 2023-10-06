import Content from '@/components/Content';
import { MainProvider } from '@/components/MainContext';
import Preview from '@/components/Preview';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Image from 'next/image';
import Replicate from 'replicate';
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

  // const replicate = new Replicate({
  //   auth: process.env.REPLICATE_API_TOKEN,
  // });

  // const output = await replicate.run(
  //   'meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3',
  //   {
  //     input: {
  //       prompt: 'can you introduce yourself',
  //     },
  //   },
  // );

  // console.log('output', output.join(''));

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
