import PageGenerator from "../components/PageGenerator";

export default function SYDPage() {
  return (
    <PageGenerator
      greetingMessage="Inner Sydney"
      timeZone="Australia/Sydney"
      storageKey="inner_sydney"
    />
  );
}
