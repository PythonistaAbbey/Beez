/** Public sources behind every factual statement on the concept site. See docs/01-research-and-sitemap.md. */
export const SOURCES = {
  home: "https://beez.com.sa/",
  about: "https://beez.com.sa/about.php",
  why: "https://beez.com.sa/whyBeez.php",
  logistics: "https://beez.com.sa/logistics.php",
  warehousing: "https://beez.com.sa/warehousing.php",
  fourPl: "https://beez.com.sa/fourth-party-logistics.php",
  it: "https://beez.com.sa/it-solution.php",
  service: "https://beez.com.sa/customer-service.php",
  contact: "https://beez.com.sa/contact.php",
  appStore: "https://apps.apple.com/sa/app/beez-logistics/id6477186733",
  salla: "https://help.salla.sa/en/article/beez-logistics-app/d3wo6hex2khyx36299202g15",
} as const;

export type SourceKey = keyof typeof SOURCES;

export const shortUrl = (k: SourceKey) => SOURCES[k].replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
