import Link from "next/link";

export default function FAQ() {
  return (
    <div className="flex flex-col max-w-124 justify-center gap-12 w-full self-center">
      <h1 className="text-2xl font-bold mb-6 self-center">FAQ</h1>
      <div className="space-y-4 text-left pb-8">
        <FAQItem
          question="Who made this?"
          answer={
            <p>
              Jackson:&nbsp;
              <Link
                href="https://github.com/SwanHub"
                target="_blank"
                className="hover:underline"
              >
                gh.com/SwanHub
              </Link>
            </p>
          }
        />
        <FAQItem
          question="Is it open source?"
          answer={
            <p>
              Yes:&nbsp;
              <Link
                href="https://github.com/SwanHub/chalamet-web"
                target="_blank"
                className="hover:underline"
              >
                gh.com/SwanHub/chalamet-web
              </Link>
            </p>
          }
        />
        <FAQItem
          question="How does it work?"
          answer="Take a screenshot. We compare that screenshot to a list of Timothée Chalamet images using Roboflow and OpenAI's CLIP model."
        />
        <FAQItem
          question="Is it accurate?"
          answer="No - CLIP is prone to errors, but not bad!"
        />
        <FAQItem
          question="I don't want my image in the database anymore. Who do I contact?"
          answer="Email me: jackson@roboflow.com"
        />
      </div>
    </div>
  );
}

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) => {
  return (
    <div>
      <h3 className="font-bold text-lg">{question}</h3>
      {answer}
    </div>
  );
};
