export const PrivacyPolicy = () => {
  return (
    <div className="py-8 px-6 max-w-3xl mx-auto text-white bg-gray-900 rounded-2xl mb-36">
      <h1 className="text-3xl font-bold mb-6">
        Privacy Policy and Terms of Use
      </h1>
      <p className="mb-6">May 27th 2025</p>

      <ol className="list-decimal list-inside space-y-4 text-left pb-8">
        <li>
          I created this project 100% just for fun, experimenting with a few new
          tools: OpenAI&apos;s CLIP model, Roboflow for inference and model
          hosting, Vercel for site deployment, and Supabase as a database with
          native vector embedding support.
        </li>
        <li>This project is non-commercial - for the love of the game.</li>
        <li>
          I have absolutely nothing to do with Anthony Po (organizer of the
          original lookalike contest in NYC) or Knicks superfan Timothée
          Chalamet.
        </li>
        <li>
          All the data is anonymous. The only stuff I&apos;m storing are the
          things you see - images, vector embeddings, comparison scores and
          up/downvotes.
        </li>
        <li>If you are in Illinois or Texas, do not play this game.</li>
      </ol>
    </div>
  );
};
