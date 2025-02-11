/* eslint-disable @next/next/no-img-element */
import { diffLines, diffWordsWithSpace } from "diff";
import { assignIDToToken, codeToToken } from "../codeToken";
import Client from "./client";
import { Outro } from "../ui/Outro";
import { AnimateCode } from "../ui/AnimateCode";

export default async function Home() {



  const a1 = `good
dog`
  const a2 = `bad
dog`
  const a3 = `bad
cat`

  // Code from delba's 
  // https://x.com/delba_oliveira/status/1851696596464894333

  const c1 = `async function MyComponent() {
  const data = await fetch('  ')
  return (   )  
}
  
export default async function Page() {
  return (
    <>
      <MyComponent />
    </>
  )
}`
  const c2 = `import { Suspense } from "react"
  
async function MyComponent() {
  const data = await fetch('  ')
  return (   )  
}
  
export default async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  )
}`
  const c3 = `"use cache"
  
async function MyComponent() {
  const data = await fetch('  ')
  return (   )  
}
  
export default async function Page() {
  return (
    <>
      <My Component />
    </>
  )
}`
  const c4 = `function processData(input) {
  return input * 2;
}`
  const c5 = `function processData(input) {
  if (typeof input !== 'number') {
    return 'Invalid input';
  }
  return input * 2;
}`
  const c6 = `function processData(input) {
  if (typeof input !== 'number') {
    console.error('Error: Input is not a number');
    return 'Invalid input';
  }
  const result = input * 2;
  console.log(\`Processing input: \${ input }, result: \${ result }\`);
  return result;
}`

  const b1 = await codeToToken(a1)
  const b2 = await codeToToken(a2)
  const b3 = await codeToToken(a3)
  const t1 = await codeToToken(c1)
  const t2 = await codeToToken(c2)
  const t3 = await codeToToken(c3)
  const t4 = await codeToToken(c4)
  const t5 = await codeToToken(c5)
  const t6 = await codeToToken(c6)


  return (
    <div className="p-8  flex min-h-screen items-center justify-center flex-col [&_a]:underline bg-[#902B07] bg-[url(/grid.svg)]">
      <div className="bg-[#D4420C] p-8 rounded-xl text-[#F8B660] shadow-[0_60px_0_0_#ac3408,_0_60px_40px_20px_#0002,_inset_0px_2px_2px_0_#e5501a,_inset_0px_-2px_2px_0_#a9380f] relative">
        <Client tokens={[b1, b2, b3, t1, t2, t3, t4, t5, t6]} />
        <div className="mt-2 -mb-4 font-semibold opacity-60">Prototype property of LAVA. Please return if found.</div>
        <img className="absolute -bottom-16 right-4 scale-y-50 opacity-20" src="/logo.svg" alt="" />
      </div>
      <Outro />
    </div>
  );
}


