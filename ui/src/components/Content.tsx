'use client';
import { useState } from 'react';
import { DragDropContext, Draggable, DropResult, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import { useMainContext } from './MainContext';
import ContentItem from './ContentItem';
import { useRouter } from 'next/navigation';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Content() {
  const { routes, currentPage, removeLayout, swapLayout } = useMainContext();
  const router = useRouter();
  const [generating, setGenerating] = useState<boolean>(false);

  const onDelete = (index: number) => {
    removeLayout(index);
  };

  const onGenerate = async () => {
    setGenerating(true);
    const response = await fetch('http://localhost:3232/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routes[currentPage]),
    });
    setGenerating(false);
  };

  const onDragEnd = (result: DropResult) => {
    console.log('onDragEnd', result);
    const destIndex = result.destination?.index;
    const sourceIndex = result.source.index;
    if (destIndex === undefined) return;

    swapLayout(sourceIndex, destIndex);
  };

  return (
    <div className="relative bg-gray-100 w-full h-screen overflow-y-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="component">
          {(provided, snapshot) => {
            return (
              <section
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="content w-[600px] mx-auto py-12 space-y-2"
              >
                {routes[currentPage || 0]?.layouts.map((layout, index) => {
                  return (
                    <Draggable key={layout + index} draggableId={layout + index} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center gap-2 group"
                        >
                          {/* <div className="px-6 py-3 border bg-white w-full">{layout}</div> */}
                          <ContentItem name={layout} />
                          <span className="grow-0 w-[30px] text-gray-500 cursor-pointer">
                            <XMarkIcon className="p-1 group-hover:block hidden" onClick={() => onDelete(index)} />
                          </span>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </section>
            );
          }}
        </Droppable>
      </DragDropContext>
      <div className="fixed bottom-4 right-4 flex flex-row">
        <button
          onClick={() => router.push(`/preview?page=${routes[currentPage].page}`)}
          className="px-6 py-2 border rounded-md bg-yellow-300 text-black mr-2"
        >
          Preview
        </button>
        <button
          onClick={onGenerate}
          className="px-6 py-2 border rounded-md bg-indigo-500 text-white flex flex-row gap-2"
        >
          <span>Generate</span>
          {generating && <ArrowPathIcon className="animate-spin w-5" />}
        </button>
      </div>
    </div>
  );
}
