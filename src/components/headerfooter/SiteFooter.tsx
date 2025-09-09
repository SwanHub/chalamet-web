import Link from "next/link";
import Image from "next/image";

export const SiteFooter = () => {
  return (
    <footer className="w-full border-t mt-16 py-4">
      <div className="flex flex-wrap justify-center items-center gap-2 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Made by</span>
          <Link
            href="https://www.linkedin.com/in/jackson-prince/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:underline focus:underline focus:outline-none hover:italic"
            aria-label="Jackson's LinkedIn profile"
          >
            Jackson
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

        <nav className="flex items-center gap-2" aria-label="Footer navigation">
          <Link
            href="/privacy"
            className="text-xs hover:underline focus:underline focus:outline-none hover:italic"
          >
            Privacy
          </Link>
          <Link
            href="/faq"
            className="text-xs hover:underline focus:underline focus:outline-none hover:italic"
          >
            FAQ
          </Link>
        </nav>
      </div>
    </footer>
  );
};
