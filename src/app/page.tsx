import { Client } from "./client";
import { diffWordsWithSpace } from "diff";
import { assignIDToToken, codeToToken, flattenToken } from "./codeToken";
import type { ThemedToken } from "shiki";

export default async function Home() {

  const getCode = (isFixedSpeed: boolean) => {
    return `const [arr, setArr] = useState(initialArray)
return (
  <ReorderArray${ isFixedSpeed ? ` usingFixedSpeed` : `` } speed={s} duration={d}>
    {arr.map(item => <Card key={item.id} data={item} />)}
  </ReorderArray>
)`
  }

  const t1 = await codeToToken(getCode(true))
  const t2 = await codeToToken(getCode(false))

  return (
    <div className="min-h-screen px-10 flex flex-col items-start [&_a]:underline bg-gradient-to-tl from-[#fff1] to-[#fff2]">
      <Client code={[t1, t2]} />
    </div>
  );
}


function tokenToRaw(token: ThemedToken[][]) {
  const array: string[] = []
  for (let row = 0; row < token.length; row++) {
    for (let tokenIndex = 0; tokenIndex < token[row].length; tokenIndex++) {
      const tokenContent = token[row][tokenIndex].content
      array.push(tokenContent)
    }
  }
  return array.join('')
}

