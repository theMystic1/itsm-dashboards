export function humanSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0,
    n = bytes;
  while (n >= 1000 && i < units.length - 1) {
    n /= 1000;
    i++;
  }
  return `${n.toFixed(n < 10 ? 2 : 1)} ${units[i]}`;
}

export function formatDateProper(date: Date, locale?: string): string {
  // On the server, fall back to a safe default
  const userLocale =
    typeof navigator !== "undefined" && navigator.language
      ? navigator.language
      : locale || "en-CA";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat(userLocale, options).format(date);
}

export const getTimeAgo = (
  dateString: string,
  locale: string = "en-CA"
): string => {
  const actionDate = new Date(dateString);
  const now = new Date();

  const diffInSeconds = Math.floor(
    (now.getTime() - actionDate.getTime()) / 1000
  );
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec${diffInSeconds === 1 ? "" : "s"} ago`;
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  if (diffInHours < 24) {
    return `${diffInHours} hr${diffInHours === 1 ? "" : "s"} ago`;
  }

  if (diffInDays === 1) {
    return "Yesterday";
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "2-digit",
  };

  // Use provided locale or fallback
  return actionDate.toLocaleDateString(
    typeof navigator !== "undefined" && navigator.language
      ? navigator.language
      : locale,
    options
  );
};
export function formatTo12Hour(date: Date) {
  if (!(date instanceof Date)) {
    date = new Date(date); // allow string or timestamp too
  }

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
}

// MentionText.tsx

type Token =
  | { type: "text"; value: string }
  | { type: "mention"; value: string; raw: string };

const mentionRegex = /@([\p{L}\p{N}_.-]+)/gu;
// matches @name with letters/numbers/underscore/dot/dash (Unicode-safe)

export function tokenizeMentions(input: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of input.matchAll(mentionRegex)) {
    const start = m.index ?? 0;
    if (start > last)
      tokens.push({ type: "text", value: input.slice(last, start) });
    tokens.push({ type: "mention", value: m[1], raw: m[0] });
    last = start + m[0].length;
  }
  if (last < input.length)
    tokens.push({ type: "text", value: input.slice(last) });
  return tokens;
}
