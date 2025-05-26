export const compareToCentroid = async (imageUrl: string): Promise<any> => {
  const response = await fetch(
    "http://127.0.0.1:8000/general_chalamet_similarity",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageUrl }),
    }
  );

  const result = await response.json();
  return result;
};
