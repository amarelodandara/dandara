export const KINDS = ["link", "book", "quote", "movie", "person"] as const;

export type Kind = (typeof KINDS)[number];
