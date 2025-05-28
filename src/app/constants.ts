export const LEADERBOARD_PAGE_SIZE = 10;

export const BG_IMAGES = [
  "https://m.media-amazon.com/images/M/MV5BZTIyZWY4ZjktOGJiZi00NGFkLTllMjctZjJjMmNiMjIxOTY2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  "https://m.media-amazon.com/images/M/MV5BYjUxNDRmOGEtMDc3OC00MjNiLWE3ZjMtN2FiOGNjYzNmYzUyXkEyXkFqcGc@._V1_QL75_UX804_.jpg",
  "https://m.media-amazon.com/images/M/MV5BZjJhYzVjNzctMjkwOC00N2Q5LWEwMDktNGE2OTRlMDQ5OGEzXkEyXkFqcGc@._V1_QL75_UX1640_.jpg",
  "https://m.media-amazon.com/images/M/MV5BNmQ2MjhhOGQtMjEwYi00Y2NiLWEyMWUtODJkZWM3MjliMTUyXkEyXkFqcGc@._V1_QL75_UX1616_.jpg",
];

export const NYT_ARTICLE =
  "https://www.nytimes.com/2024/10/28/nyregion/timothee-chalamet-lookalike-contest-new-york.html";

interface RankMessage {
  message: string;
  condition: (rank: number, total: number) => boolean;
}

export const RESULT_MESSAGES: RankMessage[] = [
  {
    message: "👑👑👑",
    condition: (rank) => rank === 1,
  },
  {
    message: "The resemblance is uncanny.",
    condition: (rank) => rank === 2,
  },
  {
    message: "Top 👏 3 👏",
    condition: (rank) => rank === 3,
  },
  {
    message: "Pretty darn close...",
    condition: (rank, total) => rank <= Math.floor(total * 0.1),
  },
  {
    message: "The Chalamet-ness is palpable",
    condition: (rank, total) => rank <= Math.floor(total * 0.2),
  },
  {
    message: "Not bad 👌",
    condition: (rank, total) => rank <= Math.floor(total * 0.3),
  },
  {
    message: "There is Chalamet potential here...",
    condition: (rank, total) => rank <= Math.floor(total * 0.4),
  },
  {
    message: "Middle of the pack 🫡",
    condition: (rank, total) => rank <= Math.floor(total * 0.5),
  },
  {
    message: "The Chalamet vibes are subtle",
    condition: (rank, total) => rank <= Math.floor(total * 0.6),
  },
  {
    message: "Have you considered a bowl cut? 💇‍♂️",
    condition: (rank, total) => rank <= Math.floor(total * 0.7),
  },
  {
    message: "Well... you've got the same number of eyes 👀",
    condition: (rank, total) => rank <= Math.floor(total * 0.8),
  },
  {
    message: "At least you're not last? 🤷‍♂️",
    condition: (rank, total) => rank <= Math.floor(total * 0.9),
  },
  {
    message: "oof... maybe try the Paul Atreides haircut? 🏜️",
    condition: (rank, total) => rank === total,
  },
  {
    message: "Hey, not everyone can be Timmy... you be you 💪",
    condition: () => true,
  },
];

export const getResultMessage = (
  rank: number,
  totalSubmissions: number
): string => {
  return (
    RESULT_MESSAGES.find(({ condition }) => condition(rank, totalSubmissions))
      ?.message || "Results are in..."
  );
};
