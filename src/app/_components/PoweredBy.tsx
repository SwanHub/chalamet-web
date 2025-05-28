import Link from "next/link";

export const PoweredBy = () => {
  return (
    <div className="flex flex-col items-center gap-6 py-36">
      <span className="text-lg font-thin uppercase text-white">Powered by</span>
      <div className="flex items-center justify-center gap-8">
        <Link
          href="https://roboflow.com/?ref=chalamet"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/banners/roboflow-icon.png"
            alt="Roboflow"
            className="h-12 rounded-full"
          />
        </Link>
        <Link
          href="https://supabase.com/?ref=chalamet"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/banners/supabase-icon.jpeg"
            alt="Supabase"
            className="h-12 rounded-full"
          />
        </Link>
        <Link
          href="https://vercel.com/?ref=chalamet"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/banners/vercel-icon.png"
            alt="Vercel"
            className="h-12 rounded-full"
          />
        </Link>
      </div>
    </div>
  );
};
