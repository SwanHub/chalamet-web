export const calculateTextClipComparison = async (
  imageUrl: string
): Promise<number[] | undefined> => {
  try {
    const response = await fetch("/api/compare_text_clip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: imageUrl }),
    });
    const data: any = await response.json();
    return data;
  } catch (error) {
    console.error("Error testing server side:", error);
  }
};
