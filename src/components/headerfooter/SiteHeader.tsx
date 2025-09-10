import Link from "next/link";

export const SiteHeader = () => {
  return (
    <header className="flex flex-col w-full items-center justify-center py-12">
      <img
        src="/images/flyer.png"
        alt="Timothee Chalamet"
        className="w-16 h-16 rounded-full border"
      />
      <Link href="/" className="pb-4">
        <h1 className="font-bold text-5xl">chalamet.wtf</h1>
      </Link>
      <h3 className="text-lg text-center">
        Timothee Chalamet Look alike Competition
        <br />
        Judged by{" "}
        <span className="font-bold bg-yellow-300 text-black">an AI</span>
      </h3>
    </header>
  );
};
