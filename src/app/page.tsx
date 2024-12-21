import { Client } from "./client";

export default function Home() {
  return (
    <div className="p-8  flex flex-col items-start">
      <h1 className="text-4xl font-semibold mb-8">Array FLIP Animation ✨</h1>
      <Client />
    </div>
  );
}
