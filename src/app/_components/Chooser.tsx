"use client";

import { useState } from "react";
import TextToImageSimilarity from "./TextToImage";
import ImageToImageSimilarity from "./ImageToImage";
import AvgToImageSimilarity from "./AvgToImage";
import NewUser from "./NewUser";

export const Chooser = () => {
  const [filter, setFilter] = useState(4);
  switch (filter) {
    case 1:
      return <TextToImageSimilarity />;
    case 2:
      return <ImageToImageSimilarity />;
    case 3:
      return <AvgToImageSimilarity />;
    case 4:
      return <NewUser />;
  }
};
