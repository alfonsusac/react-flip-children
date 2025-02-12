import { getPublishedVersion } from "../lib/npm";
import Home from "./client";

export default async function HomePage() {
  return (
    <Home version={await getPublishedVersion()} />
  );  
}