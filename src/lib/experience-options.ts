export const RECOMMENDATION_LEVELS = [
  { value: "highly-recommend", label: "Highly recommend" },
  { value: "recommend", label: "Recommend" },
  { value: "neutral", label: "Neutral" },
  { value: "not-recommended", label: "Would not recommend" },
] as const;

export const WOULD_CHOOSE_AGAIN = [
  { value: "yes", label: "Yes, without hesitation" },
  { value: "maybe", label: "Maybe, with some doubts" },
  { value: "no", label: "No, I would pick differently" },
] as const;

export const OUTCOME_STATUSES = [
  { value: "employed", label: "Employed" },
  { value: "higher-study", label: "Pursuing further study" },
  { value: "entrepreneurship", label: "Running my own venture" },
  { value: "still-searching", label: "Still searching" },
  { value: "other", label: "Other" },
] as const;

export const FIELD_RELEVANCE = [
  { value: "directly", label: "Directly related to my field" },
  { value: "partially", label: "Partially related" },
  { value: "not", label: "Not related at all" },
] as const;

export const RATING_CATEGORIES = [
  { key: "academics", label: "Academics & teaching quality" },
  { key: "campusLife", label: "Campus life" },
  { key: "facilities", label: "Facilities & resources" },
  { key: "societies", label: "Societies & activities" },
] as const;

export const EXPERIENCE_MIN_STORY = 150;
export const EXPERIENCE_MAX_LIST_ITEMS = 5;
