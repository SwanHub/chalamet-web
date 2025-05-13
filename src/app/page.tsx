import { Chooser } from "./_components/Chooser";
import TextToImageSimilarity from "./_components/TextToImage";

// plan
// 1. Try CLIP text <> image cosine similarity. DONE. (band of 10% to 35%)
// 2. Try CLIP image <> image cosine similarity. DONE. (band of 45% => 86%)
// 3. Try CLIP image(avg) <> image cosine similarity. DONE. (band of 45 => 90%)
// 4. Tune a model on chalamet (object classification).
// 5. End: add leaderboard and fun mechanics.

// Bonus:
// - add a new block to workflows that's CLIP for image to image.
// - release on iOS + android for maximal virality (browse will have to do for now)

// questions:
// - is CLIP the right model to use here? Good for text + image, but we're looking for image-to-image similarity.
// - how does 'inference' as a .py package?
// - what is batch job? Going to roboflow documentation.

// notes:
// - instead of measuring cosine similarity between text_embedding and image_embedding (paint.wtf), we will measure similarity between image_embedding_chalamet and image_embedding_user
// - we should first do a simple test.
// - will be in .py land
// - we have good starter code in the paint.wtf blog. Let's use that, but switch out the embeddings to be two pictures of timothee chalamet.
// - interesting that its an array with 500 elements.

// afterward:
// -- Create a new block in Roboflow that is cosine similarity between two given input images.

export default function Home() {
  return (
    <main className="flex flex-col gap-6 items-center justify-center p-12">
      <Chooser />
    </main>
  );
}
