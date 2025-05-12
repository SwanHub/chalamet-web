export default function Home() {
  const chalametBanner =
    "https://media.gq.com/photos/671f04b09155ff5c7031738d/1:1/w_1749,h_1749,c_limit/241027_GQ-TCLookalike-4577_WM.jpg";
  return (
    <main className="flex flex-col gap-6 items-center justify-center p-12">
      <h1 className="font-bold">Chalamet.wtf</h1>
      <p>A global lookalike competition</p>
      <img
        src={chalametBanner}
        className="w-full object-contain aspect-video"
      />
    </main>
  );
}
