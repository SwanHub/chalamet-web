export default function Privacy() {
  return (
    <div className="flex flex-col max-w-124 justify-center gap-12 w-full self-center">
      <h1 className="text-2xl font-bold mb-6 self-center">Privacy and Terms</h1>
      <p className="mb-6">May 27th 2025</p>

      <ol className="list-decimal list-inside space-y-4 text-left pb-8">
        <li>I created this project for fun, trying out some new tools.</li>
        <li>This project is non-commercial.</li>
        <li>
          I have absolutely nothing to do with AnthPo or Knicks superfan
          Timothée Chalamet.
        </li>
        <li>All the data is anonymous. Only storing the stuff you see.</li>
        <li>If you are in Illinois or Texas, do not play this game.</li>
      </ol>
    </div>
  );
}
