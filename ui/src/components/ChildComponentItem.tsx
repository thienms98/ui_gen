import { useMainContext } from "./MainContext";

interface IChildComponentItemProps {
  name: string;
}

export default function ChildComponentItem({ name }: IChildComponentItemProps) {
  const { addLayout, layouts } = useMainContext();
  return (
    <div
      onClick={() => {
        // if (layouts.includes(name)) {
        //   alert(name + "already added");
        //   return;
        // }
        addLayout(name);
      }}
      className="px-2 py-1 text-sm text-gray-500 cursor-pointer border rounded-md hover:bg-gray-50"
    >
      <img
        src={`http://localhost:3232/assets/tailwindui/preview/${name}.png`}
      />
      {name}
    </div>
  );
}
