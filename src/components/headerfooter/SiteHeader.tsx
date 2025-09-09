import Link from "next/link";

export const SiteHeader = () => {
  return (
    <header className="flex flex-col w-full items-center justify-center py-12">
      <Link href="/">
        <h1 className="font-bold text-5xl">chalamet.wtf</h1>
      </Link>
    </header>
  );
};
