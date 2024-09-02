import PageGenerator from "../components/PageGenerator";

export default function SYDPage() {
  return (
    <PageGenerator
      greetingMessage="Sydney"
      timeZone="Australia/Sydney"
      storageKey="syd_image_urls"
    />
  );
}
