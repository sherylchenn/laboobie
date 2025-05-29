import slugify from "slugify";
import { goRules } from "./go";
import { terraformRules } from "./terraform";
import { typescriptRules } from "./typescript";

export const rules: Rule[] = [
  ...goRules,
  ...terraformRules,
  ...typescriptRules,
].map(
  (rule): Rule => ({
    ...rule,
    libs: [],
  }),
);

export function getSections() {
  const categories = Array.from(new Set(rules.flatMap((rule) => rule.tags)));

  return categories
    .map((tag) => ({
      tag,
      rules: rules.filter((rule) => rule.tags.includes(tag)),
      slug: slugify(tag, { lower: true }),
    }))
    .sort((a, b) => b.rules.length - a.rules.length);
}

export function getSectionBySlug(slug: string) {
  return getSections().find((section) => section.slug === slug);
}

export function getRuleBySlug(slug: string) {
  return rules.find(
    (rule) => rule.slug === slug || rule.slug === `official/${slug}`,
  );
}

export interface Rule {
  title: string;
  slug: string;
  tags: string[];
  libs: string[];
  content: string;
  author?: {
    name: string;
    url: string | null;
    avatar: string | null;
  };
}

export type Section = {
  tag: string;
  rules: Rule[];
};
