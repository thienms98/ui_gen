'use client';

import Image from 'next/image';
import { ILayoutGroup } from '@/app/page';
import { useRef, useState } from 'react';
import ChildComponentItem from './ChildComponentItem';

export default function Sidebar({ layouts }: { layouts: ILayoutGroup }) {
  const components = Object.keys(layouts);
  const [name, setName] = useState(components[0]);
  const [term, setTerm] = useState('');
  const selectedLayouts = layouts[name];
  const timeout = useRef(0);

  const onSearch = (value: string) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      setTerm(value.toLowerCase());
    }, 500) as unknown as number;
  };

  return (
    <aside className="shrink-0 flex">
      <section className="flex flex-col w-[250px] border-r p-2 h-screen overflow-y-auto">
        <input
          className="block w-full border rounded-md shadow-sm px-4 py-2 mb-2 text-sm text-gray-500"
          onChange={(ev) => {
            onSearch(ev.target.value);
          }}
        />
        {components.map((compName) => {
          const children = layouts[compName];
          const total = children && children.length ? children.length : 0;
          const active = compName === name ? 'active' : '';

          if (term && !compName.toLowerCase().includes(term)) {
            return null;
          }

          return (
            <div
              key={compName}
              className={`component-item group ${active}`}
              onClick={() => {
                setName(compName);
              }}
            >
              <div className="component-item-container">
                <Image
                  src={`/marketing-pages/${compName}.png`}
                  width={250}
                  height={70}
                  className="rounded-t-md"
                  alt={compName}
                />
                <h2 className="text-sm text-gray-600 border-t px-2 py-1">
                  {compName}
                  <span className="block text-xs text-gray-400">{total} components</span>
                </h2>
              </div>
            </div>
          );
        })}
      </section>
      <section className="flex flex-col gap-2 w-[200px] border-r p-4 overflow-y-auto h-screen">
        {selectedLayouts.map((layout) => {
          return <ChildComponentItem name={layout} key={layout} />;
        })}
      </section>
    </aside>
  );
}
