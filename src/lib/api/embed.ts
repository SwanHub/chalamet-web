export const createVectorEmbOfImage = async (imageUrl: string) => {
  try {
    const response = await fetch("/api/embed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: imageUrl }),
    });
    const data = await response.json();
    console.log("successfully did something: ", data);
  } catch (error) {
    console.error("Error testing server side:", error);
  }
};
