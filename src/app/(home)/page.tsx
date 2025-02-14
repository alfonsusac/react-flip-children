import { readdir, readFile } from "fs/promises";
import { getPublishedVersion } from "../lib/npm";
import Home from "./client";

export default async function HomePage() {

  const codes: Codes = {
    apikeys: await read("example.apikeys"),
    formbuilder: await read("example.formbuilder"),
    gallery: await read("example.gallery"),
    multistep: await read("example.multistep"),
    notifications: await read("example.notifications"),
    title: await read("example.title"),
    accordion: await read("example.accordion"),
  }

  return (
    <Home
      version={await getPublishedVersion()}
      codes={codes}
    />
  );
}

const read = async (name: string) => {
  return await readFile(`./src/app/(home)/${ name }.tsx`, { encoding: "utf-8" });
}

export type Codes = {
  apikeys: string;
  formbuilder: string;
  gallery: string;
  multistep: string;
  notifications: string;
  title: string;
  accordion: string;
}