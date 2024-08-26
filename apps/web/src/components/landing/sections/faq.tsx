import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import LandingSection from "./landing-section";
import SectionTitle from "./section-title";

const questions = [
  {
    question: "How does Fuzzie handle failed webhook requests?",
    answer:
      "All failed webhook requests will be retried following a retry strategy.",
  },
];

export default function FAQ() {
  return (
    <LandingSection>
      <SectionTitle
        title="We respond to your questions."
        subtitle="Frequently asked questions"
      />

      <Accordion type="single" collapsible className="w-full">
        {questions.map(({ question, answer }) => (
          <AccordionItem key={question} value={question}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </LandingSection>
  );
}
