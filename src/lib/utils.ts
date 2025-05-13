export function formatRelativeTimestamp(
  timestamp: string | number | Date
): string {
  // Convert input to Date object
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  // Get current time
  const now = new Date();

  // Calculate time difference in seconds
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than 60 seconds
  if (diffInSeconds < 60) {
    return "just now";
  }

  // Less than 60 minutes
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}${minutes === 1 ? "min" : "mins"} ago`;
  }

  // Less than 24 hours
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}${hours === 1 ? "hr" : "hrs"} ago`;
  }

  // Less than 48 hours (yesterday)
  if (diffInSeconds < 172800) {
    return "yesterday";
  }

  // Check if it's within the current year
  const currentYear = now.getFullYear();
  const timestampYear = date.getFullYear();

  // Format as MM/DD/YY
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  // If same year, omit the year
  if (currentYear === timestampYear) {
    return `${month}/${day}`;
  }

  // Otherwise include the year as YY
  const yearShort = timestampYear.toString().slice(-2);
  return `${month}/${day}/${yearShort}`;
}
