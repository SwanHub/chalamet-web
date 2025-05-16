import Link from "next/link";

export const HowItWorks = () => {
  return (
    <div className="py-24 px-6 max-w-3xl mx-auto text-white">
      {/* Roboflow Logo */}
      <div className="flex justify-center mb-8">
        <img src="/roboflow.png" alt="Powered by Roboflow" className="h-12" />
      </div>

      {/* How It Works Heading */}
      <h1 className="text-3xl font-bold mb-6">How it works</h1>

      {/* Explanation Steps */}
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
          transformed into a vector using{" "}
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
          <strong>Compare with Timothée:</strong> That vector (a numerical
          representation of your screenshot) is then compared against a small
          dataset of Timothée Chalamet images.
        </li>
        <li>
          <strong>Get your score:</strong> We assign your image a similarity
          score based on the closest match using{" "}
          <Link
            href="https://en.wikipedia.org/wiki/Cosine_similarity"
            className="text-cyan-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            cosine similarity
          </Link>
          .
        </li>
      </ol>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold">Is this project open source?</h3>
            <span>
              Yes! Check out the full code{" "}
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
            <h3 className="font-bold">
              Do I need to upload a high-quality photo?
            </h3>
            <p>
              Not necessarily. Just make sure your face is clearly visible and
              facing the camera.
            </p>
          </div>
          {/* <div>
            <h3 className="font-bold">
              What happens to my image after submission?
            </h3>
            <p>It joins all other anonymous submissions!</p>
          </div> */}
          <div>
            <h3 className="font-bold">
              Is this affiliated with Timothée Chalamet?
            </h3>
            <p>Nope! This is just a fun community project for fans.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
