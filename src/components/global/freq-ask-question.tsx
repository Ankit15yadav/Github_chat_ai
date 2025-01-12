'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "How does the repo chatbot work?",
        answer: "Our repo chatbot uses advanced AI to analyze your GitHub repository's code, issues, and pull requests. It can answer questions, explain code, and provide insights based on the content of your repository."
    },
    {
        question: "Is my code safe and private?",
        answer: "Absolutely. We take security and privacy very seriously. Our system only accesses the repositories you explicitly grant permission to, and we never store your code. All interactions are encrypted and temporary."
    },
    {
        question: "Can I use this with private repositories?",
        answer: "Yes, you can use our chatbot with both public and private repositories. You'll need to grant access to your private repos (By Github Token) , but rest assured that your code remains confidential and is only used for generating responses to your queries."
    },
    {
        question: "What types of questions can I ask?",
        answer: "You can ask a wide range of questions about your repository. This includes code explanations, best practices, bug investigations, architecture questions, and even questions about the project's history or contribution patterns."
    },
    {
        question: "How accurate are the responses?",
        answer: "Our AI model is highly accurate and constantly improving. However, it's important to note that while it provides valuable insights, it should be used as a tool to assist developers, not replace human judgment. Always verify critical information."
    },

]

export function FAQAccordion() {
    return (
        <>
            <h1 className="text-center mt-10 font-extrabold text-teal-800 text-4xl">FAQ's</h1>
            <Accordion type="single" collapsible className="w-11/12 mx-auto mt-3">
                {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-gray-800 dark:text-gray-200 hover:text-teal-500 transition-colors">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-400">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </>

    )
}
