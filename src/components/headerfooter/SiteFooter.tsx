import Link from "next/link";
import Image from "next/image";

export const SiteFooter = () => {
  return (
    <footer className="w-full border-t mt-16 py-4 z-30 bottom-0 left-0 right-0 fixed bg-white">
      <div className="flex flex-wrap justify-center items-center gap-2 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Made by</span>
          <Link
            href="https://www.github.com/SwanHub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:underline focus:underline focus:outline-none"
            aria-label="Author's github profile"
          >
            JP
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">using</span>
          <Link
            href="https://roboflow.com/?ref=chalamet.wtf"
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Roboflow - Computer Vision Platform"
          >
            <Image
              src="/banners/roboflow-icon.png"
              alt="Roboflow logo"
              width={16}
              height={16}
              className="rounded-full"
            />
          </Link>
          <Link
            href="https://supabase.com/?ref=chalamet.wtf"
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Supabase - Open Source Firebase Alternative"
          >
            <Image
              src="/banners/supabase-icon.jpeg"
              alt="Supabase logo"
              width={16}
              height={16}
              className="rounded-full"
            />
          </Link>
          <Link
            href="https://vercel.com/?ref=chalamet.wtf"
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Vercel - Frontend Cloud Platform"
          >
            <Image
              src="/banners/vercel-icon.png"
              alt="Vercel logo"
              width={16}
              height={16}
              className="rounded-full"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">inspired by</span>
          <Link
            href="https://www.nytimes.com/2024/10/28/nyregion/timothee-chalamet-lookalike-contest-new-york.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:underline focus:underline focus:outline-none"
            aria-label="Anthpo's YouTube channel"
          >
            {"Anthpo's viral event"}
          </Link>
          <span className="text-xs text-gray-600">-</span>
        </div>

        <nav className="flex items-center gap-2" aria-label="Footer navigation">
          <Link
            href="/privacy"
            className="text-xs hover:underline focus:underline focus:outline-none"
          >
            Privacy
          </Link>
          <Link
            href="/faq"
            className="text-xs hover:underline focus:underline focus:outline-none"
          >
            FAQ
          </Link>
        </nav>
      </div>
    </footer>
  );
};
