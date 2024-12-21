import { codeToTokens } from "shiki";
import { Client } from "./client";

export default async function Home() {
  const { tokens } = await codeToTokens(`<ReorderArray>
  {arr.map(item => (
    <div key={item}>{item}</div>
  ))}
</ReorderArray>`, {
    theme: 'dark-plus',
    lang: 'tsx'
})
  
  
  return (
    <div className="p-8  flex flex-col items-start [&_a]:underline">
      <Client token={tokens} />
    </div>
  );
}
