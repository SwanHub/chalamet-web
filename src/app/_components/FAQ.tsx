import Link from "next/link";

export const FAQ = () => {
  return (
    <div className="py-8 px-6 max-w-3xl mx-auto text-white bg-gray-900 rounded-2xl border border-cyan-800">
      <h1 className="text-3xl font-bold mb-6">FAQ</h1>
      <div className="space-y-4 text-left pb-8">
        <div>
          <h3 className="font-bold text-lg">Who made this?</h3>
          <span>
            <Link
              href={"https://www.linkedin.com/in/jackson-prince/"}
              target="_blank"
              className="text-cyan-500 underline"
              rel="noopener noreferrer"
            >
              Jackson, hello!
            </Link>
            {" 👋"}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-lg">Is it open source?</h3>
          <span>
            Yes! Code is{" "}
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
          <h3 className="font-bold text-lg">How does it work?</h3>
          <span className="text-left flex flex-col gap-4">
            <ul className="list-disc pl-6">
              <li>Take a screenshot.</li>
              <li>
                We compare that screenshot to a list of Timothée Chalamet images
                using{" "}
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
                and cosine similarity.
              </li>
              <li>
                We assign your screenshot a score based on its average
                similarity to that set of Timothée Chalamet images.
              </li>
            </ul>
            {/* <p>
              You can read more about the project in this short{"  "}
              <Link
                href={"https://www.elastic.co/what-is/vector-embedding"}
                target="_blank"
                className="text-cyan-500 underline"
                rel="noopener noreferrer"
              >
                blog post
              </Link>
              .
            </p> */}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-lg">Is it 100% accurate?</h3>
          <p>
            No. CLIP considers the full image, so background, lighting, and
            pixelation all make a significant difference in your score. For
            example, you&apos;re more likely to do well if you have the exact
            same background and take up the exact same amount of the image.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-lg">
            Does Timothée Chalamet have anything to do with this?
          </h3>
          <p>
            Nope. Just a fun project inspired by the lookalike contest that
            happened in NYC in October 2024.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-lg">
            Is Anthony Po (organizer of the original lookalike contest)
            involved?
          </h3>
          <p>Nope!</p>
        </div>
        <div>
          <h3 className="font-bold text-lg">Are there prizes?</h3>
          <span>No, just for fun.</span>
        </div>
      </div>
    </div>
  );
};
