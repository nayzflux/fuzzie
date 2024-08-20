import LandingSection from "./landing-section";
import SectionTitle from "./section-title";

const questions = [
  {
    question: "How does Fuzzie handle failed webhook requests?",
    anwser: "All failed webhook requests will be retried following a retry strategy."
  }
]

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
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
        ))}
    </Accordion>
    </LandingSection>
  );
}
