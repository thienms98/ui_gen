'use client';

import { useEffect, useState } from 'react';
import { useMainContext } from './MainContext';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Preview() {
  const { template, component } = useMainContext();
  const [prompt, setPrompt] = useState<string>(
    'Change h1 to describe short about feature and p describe detail features',
  );
  const [sysPrompt, setSysPrompt] = useState<string>(
    `You are an senior frontend developer, please help me to rewrite content in h1 and p tag in these html code blocks\nBut keep all attributes of these tags. 
    \`\`\`html
    \`\`\`
    `,
  );
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const text = template.reduce((prev, current) => prev + `\`\`\`html\n${current}\n\`\`\`\n`, '');

    setSysPrompt((prev) => {
      const temp = prev;
      const newText = temp.replace(/```html(.|\r|\n)*```/gm, text || `\n\`\`\`html\n\`\`\`\n`);
      return newText;
    });
  }, [template]);

  const updatePreview = async () => {
    const temp = result.match(/```html(.|\r|\n)*```/);
    console.log(temp);

    if (!temp || temp.length === 0) return;
    await fetch('http://localhost:3232/updateDemo', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        component,
        template: temp,
      }),
    });
  };

  return (
    <div className="w-[700px] max-h-[calc(100vh_-_60px)] shrink-0 px-2 border-l overflow-y-auto">
      <form
        className="px-5 mt-10"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          // const res = await fetch('http://localhost:3232/generateText', {
          //   method: 'post',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({
          //     template,
          //     prompt,
          //     sysPrompt,
          //   }),
          // });
          // const data = await res.json();
          // setResult(await data);
          setResult(sysPrompt);
          setLoading(false);
        }}
      >
        <label htmlFor="prompt" className="block mb-2 mt-4">
          prompt
        </label>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full border border-black px-2"
        />
        <label htmlFor="systemPrompt" className="block mb-2 mt-4">
          system_prompt
        </label>
        <textarea
          id="systemPrompt"
          cols={50}
          rows={10}
          value={sysPrompt}
          onChange={(e) => setSysPrompt(`${e.target.value}`)}
          className="border border-black w-full max-h-[400px] px-2"
        ></textarea>
        <button type="submit" className="mt-4 px-5 py-1 border border-black bg-indigo-500 text-white">
          Send{loading && <ArrowPathIcon className="animate-spin" />}
        </button>
        <button
          type="button"
          className="mt-4 px-5 py-1 border border-black bg-indigo-500 text-white"
          onClick={() => {
            setSysPrompt(`You are an senior frontend developer, please help me to rewrite content in h1 and p tag\nBut keep all attributes of these tags. 
          \`\`\`html
          \`\`\`
          `);
          }}
        >
          Reset
        </button>
      </form>
      <form
        className="px-5 mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          updatePreview();
        }}
      >
        {result && <textarea className="w-full" rows={10} value={result}></textarea>}
        <button type="submit" className="mt-4 px-5 py-1 border border-black bg-indigo-500 text-white">
          Update
        </button>
      </form>
    </div>
  );
}
