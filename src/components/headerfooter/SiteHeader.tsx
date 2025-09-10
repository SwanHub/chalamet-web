import Link from "next/link";

export const SiteHeader = () => {
  return (
    <header className="flex flex-col w-full items-center justify-center py-12">
      <Link href="/" className="pb-4">
        <h1 className="font-bold text-5xl">chalamet.wtf</h1>
      </Link>
      <h3 className="text-lg text-gray-500 text-center">
        Timothee Chalamet Lookalike Competition
        <br />
        Judged by an AI
      </h3>
    </header>
  );
};
