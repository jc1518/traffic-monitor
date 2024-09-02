import PageGenerator from "../components/PageGenerator";

export default function MELPage() {
  return (
    <PageGenerator
      greetingMessage="Melbourne"
      timeZone="Australia/Melbourne"
      storageKey="mel_image_urls"
    />
  );
}
