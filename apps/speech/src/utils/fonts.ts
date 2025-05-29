import localFont from "next/font/local";

export const Waldenburg = localFont({
  src: [
    {
      path: "../assets/fonts/waldenburg/Waldenburg-Regular.woff2",
      weight: "400",
    },
    {
      path: "../assets/fonts/waldenburg/Waldenburg-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-waldenburg",
});

export const WaldenburgHF = localFont({
  src: "../assets/fonts/waldenburg-semi-condensed/Waldenburg-Bold-SemiCondensed.woff2",
  variable: "--font-waldenburg-hf",
  weight: "700",
});
