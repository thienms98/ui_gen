// import { useEffect, useState } from "react";

export default function ContentItem({ name }: { name: string }) {
  // const [html, setHtml] = useState("");

  // useEffect(() => {
  //   if (name) {
  //     fetch(`http://localhost:3232/layout/${name}`)
  //       .then((res) => res.json())
  //       .then((result) => {
  //         const { html } = result;
  //         setHtml(html);
  //       });
  //   }
  // }, [name]);
  return (
    <div
      className="px-6 py-3 border bg-white w-full"
      // dangerouslySetInnerHTML={{
      //   __html: html,
      // }}
    >
      <img
        src={`http://localhost:3232/assets/tailwindui/preview/${name}.png`}
      />
      {name}
    </div>
  );
}
