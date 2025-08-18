export interface Ad {
  id: string;
  title: string;
  description: string;
  logoUrl: string;
  link: string;
  imageUrl: string;
}

export const ads: Ad[] = [
  {
    id: "polar",
    title: "Polar",
    description: "The fastest growing engine for SaaS & Digital Products",
    logoUrl:
      "https://pub-abe1cd4008f5412abb77357f87d7d7bb.r2.dev/ads-polar-logo.svg",
    imageUrl:
      "https://pub-abe1cd4008f5412abb77357f87d7d7bb.r2.dev/ads-polar.png",
    link: "https://go.midday.ai/JYZ5WcG",
  },
];
