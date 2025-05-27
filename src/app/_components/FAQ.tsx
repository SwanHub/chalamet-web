import Link from "next/link";

export const FAQ = () => {
  return (
    <div className="py-8 px-6 max-w-3xl mx-auto text-white bg-gray-900 rounded-2xl mb-36">
      <h1 className="text-3xl font-bold mb-6">FAQ</h1>

      <div className="space-y-4 text-left pb-8">
        <div>
          <h3 className="font-bold">Why make this?</h3>
          <span>For fun.</span>
        </div>
        <div>
          <h3 className="font-bold">Who made this?</h3>
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
          <h3 className="font-bold">Is it open source?</h3>
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
          <h3 className="font-bold">How does the comparison part work?</h3>
          <span className="text-left flex flex-col gap-4">
            <p>
              Just a few simple steps - we create a list of vector embeddings of
              a bunch of different Timothée Chalamet images using OpenAI's CLIP
              model. We then use cosine similarity to compare the vector
              embedding of your screenshot to the vector embeddings of all the
              Timothée Chalamet images. You see each of those comparisons in the
              results page. Your final score is the highest{" "}
              {"Chalamet+screenshot"} comparison number, which represents the
              two most-similar images.
            </p>
            <p>
              You can read more about the project in this short{"  "}
              <Link
                href={"https://www.elastic.co/what-is/vector-embedding"}
                target="_blank"
                className="text-cyan-500 underline"
                rel="noopener noreferrer"
              >
                blog post
              </Link>{" "}
              I wrote.
            </p>
          </span>
        </div>
        <div>
          <h3 className="font-bold">Is it 100% accurate?</h3>
          <p>
            Definitely not. CLIP considers the full image, so background,
            lighting, and pixelation all make a significant difference in your
            score. For example, you're more likely to do well if you have the
            exact same background and take up the exact same amount of the
            image. I haven&apos;t done any extra processing to crop your face or
            homogenize backgrounds.
          </p>
        </div>
        <div>
          <h3 className="font-bold">
            Does Timothée Chalamet have anything to do with this?
          </h3>
          <p>
            Nope. Just a fun project inspired by the lookalike contest that
            happened in NYC in October 2024.
          </p>
        </div>
        <div>
          <h3 className="font-bold">
            Is Anthony Po (organizer of the original lookalike contest)
            involved?
          </h3>
          <p>Nope!</p>
        </div>
        <div>
          <h3 className="font-bold">What is the privacy policy?</h3>
          <p>
            <Link
              href={"https://www.elastic.co/what-is/vector-embedding"}
              target="_blank"
              className="text-cyan-500 underline"
              rel="noopener noreferrer"
            >
              Check it out
            </Link>{" "}
            (especially if you are from Illinois or Texas).
          </p>
        </div>
      </div>
    </div>
  );
};
