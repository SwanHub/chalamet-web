import Link from "next/link";

export const PrivacyPolicy = () => {
  return (
    <div className="py-8 px-6 max-w-3xl mx-auto text-white bg-gray-900 rounded-2xl mb-36">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-300 mb-6">
        my friend&apos;s brother is a lawyer and suggests I add a privacy
        policy... here it is very simply:
      </p>

      <ol className="list-decimal list-inside space-y-4 text-left pb-8">
        <li>This project </li>
        <li>
          We compare that screenshot to a list of Timothée Chalamet images using{" "}
          <Link
            href="https://roboflow.com/?ref=chalamet"
            className="text-cyan-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Roboflow
          </Link>
          ,{" "}
          <Link
            href="https://openai.com/index/clip/"
            className="text-cyan-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            CLIP
          </Link>{" "}
          and{" "}
          <Link
            href="https://en.wikipedia.org/wiki/Cosine_similarity"
            className="text-cyan-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            cosine similarity
          </Link>{" "}
          .
        </li>
        <li>
          We assign your screenshot a score based on which Timothée Chalamet
          image it most closely resembles.
        </li>
      </ol>
      <div className="flex flex-col items-center gap-6">
        <span className="text-lg font-thin uppercase">Powered by</span>
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
    </div>
  );
};
