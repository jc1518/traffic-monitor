import PageGenerator from "../components/PageGenerator";

export default function BNEPage() {
  return (
    <PageGenerator
      greetingMessage="Brisbane"
      timeZone="Australia/Brisbane"
      storageKey="bne_image_urls"
    />
  );
}
