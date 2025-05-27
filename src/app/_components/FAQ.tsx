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
          <p>
            Super simple - we create a list of vector embeddings of a bunch of
            different Timothée Chalamet images using OpenAI's CLIP model. We
            then use cosine similarity to compare the vector embedding of your
            screenshot to the vector embeddings of all the Timothée Chalamet
            images. You see the results of that comparison in the results page
            for each image, and your final score is the highest cosine
            similarity.
          </p>
        </div>
        <div>
          <h3 className="font-bold">Is it accurate?</h3>
          <p>
            Nope - there are a bunch of factors that make it not completely
            accurate. CLIP's API generates vector embeddings based on the full
            image, so background, lighting, and pixelation all make a
            significant difference.
          </p>
        </div>
        <div>
          <h3 className="font-bold">
            Does Timothée Chalamet have anything to do with this?
          </h3>
          <p>
            Nope! Just a fun project inspired by the lookalike contest that
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
      </div>
    </div>
  );
};
