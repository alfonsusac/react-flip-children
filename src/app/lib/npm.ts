export async function getPublishedVersion() {
  const res = await fetch("https://registry.npmjs.org/react-flip-children/latest") 
  if (!res.ok) {
    return "0.1.3"
  }
  const json = await res.json()
  return json.version as string

}