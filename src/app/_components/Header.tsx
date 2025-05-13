import Link from "next/link";
import { CHALAMET_BANNER } from "../constants";

export default function Header() {
  return (
    <header className="flex flex-row items-center justify-start py-6 border-b border-gray-200 gap-6 px-6">
      <img
        src={CHALAMET_BANNER}
        alt="Timothée Chalamet Banner"
        width={72}
        className="object-contain rounded-md"
      />
      <div>
        <Link href="/">
          <h1 className="font-bold text-3xl">Chalamet.wtf</h1>
        </Link>
        <p className="text-gray-600">A global lookalike competition</p>
      </div>
    </header>
  );
}
