import { ClientTestPage } from "./client";
import { Transform } from "./transform";

export default function TestPage() {

  return (
    <div className="bg-white text-black min-h-screen p-8">
      <ClientTestPage />
      {/* <div className="h-20"/> */}
      {/* <Transform /> */}
    </div>
  )
}