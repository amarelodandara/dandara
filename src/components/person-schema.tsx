import { FIND_ME } from "@/content/socials";
import { DESCRIPTION, NAME, SITE_URL, TITLE } from "@/lib/site";

const MAILTO = "mailto:";

const email = FIND_ME.find(({ href }) => href.startsWith(MAILTO))?.href.slice(
  MAILTO.length,
);

const profiles = FIND_ME.filter(({ href }) => href.startsWith("https://")).map(
  ({ href }) => href,
);

const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: NAME,
  alternateName: TITLE,
  url: SITE_URL,
  jobTitle: "Product Designer",
  description: DESCRIPTION,
  knowsAbout: ["Product design", "Design engineering", "Service design"],
  ...(email ? { email } : {}),
  sameAs: profiles,
};

export function PersonSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }}
    />
  );
}
