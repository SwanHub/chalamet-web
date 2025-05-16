import Link from "next/link";

export const HowItWorks = () => {
  return (
    <div className="py-12 px-6 max-w-3xl mx-auto text-white bg-gray-900 rounded-2xl mb-36">
      <div className="flex items-center gap-4 mb-8">
        <img
          src="/banners/roboflow-icon.png"
          alt="Powered by Roboflow"
          className="h-12"
        />
        <span className="font-semibold text-lg">
          This project is powered by{" "}
          <Link
            href="https://roboflow.com/?ref=chalamet"
            className="text-cyan-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Roboflow
          </Link>
        </span>
      </div>

      <h1 className="text-3xl font-bold mb-6">How it works</h1>

      <ol className="list-decimal list-inside space-y-4 text-left">
        <li>
          <strong>Take screenshot:</strong> Capture an image of your face.
        </li>
        <li>
          <strong>Detect face:</strong> We use{" "}
          <span className="font-mono">Roboflow</span> to identify your face in
          the image.
        </li>
        <li>
          <strong>Compute a CLIP embedding:</strong> The picture of your face is
          transformed into a vector (a numerical representation of your
          screenshot) using{" "}
          <Link
            href="https://openai.com/index/clip/"
            className="text-cyan-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            CLIP
          </Link>
          .
        </li>
        <li>
          <strong>Compare with Timothée:</strong> That vector is then compared
          against a small dataset of Timothée Chalamet images.
        </li>
        <li>
          <strong>Get your score:</strong> We use{" "}
          <Link
            href="https://en.wikipedia.org/wiki/Cosine_similarity"
            className="text-cyan-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            cosine similarity
          </Link>{" "}
          to determine which Chalamet image most closely resembles your
          submitted screenshot. You can see all image comparisons by clicking{" "}
          {"'See results'"} on an image.
        </li>
      </ol>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold">Is this project open source?</h3>
            <span>
              Yes indeed - check out the full code{" "}
              <Link
                href={"https://github.com/SwanHub/chalamet-web"}
                target="_blank"
                className="text-cyan-500 underline"
                rel="noopener noreferrer"
              >
                here
              </Link>
              .
            </span>
          </div>
          <div>
            <h3 className="font-bold">How to get clearest results?</h3>
            <p>
              The dataset of Chalamet images we&apos;re using are all very
              clearly defined profile images, so it helps to be in a well-light
              environment with your face clearly defined and not in-motion.
            </p>
          </div>
          <div>
            <h3 className="font-bold">
              Is this affiliated with Timothée Chalamet?
            </h3>
            <p>
              Nope! Just a fun project inspired by the lookalike contest that
              happened in NYC in October 2024.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
