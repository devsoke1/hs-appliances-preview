import type { FAQ } from "./types";

/**
 * Site-wide marketing copy.
 * ⚠ CLAIMS: the trust points below were requested by the business owner. Each one must be TRUE
 * before launch — edit or delete any that aren't (e.g. if you can't guarantee same/next-day).
 */
export const trustPoints = [
  "Same-day & next-day visits",
  "Fixed call-out price",
  "Domestic & commercial",
  "Insured engineers",
] as const;

export const processSteps = [
  {
    title: "Tell us the fault",
    body: "Call or book online with the appliance type, make, model and what it's doing. Photos of any error code help.",
  },
  {
    title: "We diagnose it",
    body: "An engineer visits, tests the appliance and explains the problem in plain English.",
  },
  {
    title: "Agree the price, then fix",
    body: "You get a clear quote before any repair work starts. Nothing goes ahead without your OK.",
  },
] as const;

/** Icon names map to lucide icons in components/WhyChooseUs.tsx */
export const whyChooseUs = [
  {
    icon: "clock",
    title: "Same or next-day visits",
    body: "We aim to see you the same or next day, subject to engineer availability in your area.",
  },
  {
    icon: "tag",
    title: "Fixed call-out price",
    body: "You know the call-out cost when you book — no surprises when the engineer arrives.",
  },
  {
    icon: "shield",
    title: "Insured engineers",
    body: "Work is carried out by insured engineers, at home or on your business premises.",
  },
  {
    icon: "building",
    title: "Domestic & commercial",
    body: "One local company for your kitchen at home and the refrigeration your business runs on.",
  },
  {
    icon: "clipboard",
    title: "Quote before work",
    body: "We diagnose first and explain your options. If a repair isn't worth it, we'll say so.",
  },
  {
    icon: "pin",
    title: "Local Feltham base",
    body: "Based at 209 Hounslow Road, so most of West London is a short drive away.",
  },
] as const;

/* ───────────────────────── General FAQs (/faq/ + homepage) ───────────────────────── */
export const faqGroups: { title: string; faqs: FAQ[] }[] = [
  {
    title: "Booking & visits",
    faqs: [
      {
        question: "How quickly can you come out?",
        answer:
          "We offer same-day and next-day visits subject to availability. Call us for the earliest slot, or book online and choose a 2-hour time slot that suits you — your booking is confirmed straight away.",
      },
      {
        question: "Which areas do you cover?",
        answer:
          "We're based in Feltham (TW13) and cover Hounslow, Twickenham, Ashford, Staines, Isleworth, Hayes, Southall, Richmond, Kingston, Ealing, Heathrow and the surrounding West London and Middlesex areas. Use the postcode checker on our homepage to check your area.",
      },
      {
        question: "What information should I have ready when I book?",
        answer:
          "The appliance type, brand and model number, a short description of the fault and any error code shown. The model and serial number are usually on a label inside the door, on the door edge or on the back of the appliance.",
      },
      {
        question: "Does someone need to be home during the visit?",
        answer: "Yes — an adult needs to be at the property to give access and agree the quote before any repair work starts.",
      },
    ],
  },
  {
    title: "Prices & payment",
    faqs: [
      { question: "How much is the call-out charge?", answer: "[ADD: call-out price and what it includes (e.g. diagnosis).]" },
      {
        question: "Will I know the cost before the repair?",
        answer: "Yes. After diagnosing the fault we'll give you a quote for the repair, and no work goes ahead until you've agreed it.",
      },
      { question: "How can I pay?", answer: "[ADD: accepted payment methods — card, bank transfer, cash, invoice for businesses.]" },
    ],
  },
  {
    title: "Repairs & parts",
    faqs: [
      {
        question: "Which brands do you repair?",
        answer:
          "We work on most major brands, including Beko, LG, Samsung, Bosch, AEG and Miele. If you're unsure, call us with the make and model.",
      },
      {
        question: "What if my appliance isn't worth repairing?",
        answer:
          "We'll tell you honestly. If the repair would cost more than the appliance is worth, we'll explain why so you can decide what to do.",
      },
      {
        question: "What if a part needs ordering?",
        answer: "If the part isn't available on the day, we'll order it and arrange a return visit to fit it.",
      },
      { question: "Do you guarantee your repairs?", answer: "[ADD: guarantee period and what it covers, or remove this question.]" },
    ],
  },
  {
    title: "Commercial customers",
    faqs: [
      {
        question: "Do you work with businesses?",
        answer:
          "Yes. We repair and maintain commercial refrigeration — cold rooms, dairy cabinets, display fridges, bar and cellar coolers and ice machines — for shops, restaurants, pubs, hotels and food businesses.",
      },
      { question: "Do you offer maintenance contracts?", answer: "[CONFIRM: describe any planned maintenance plans, or remove this question.]" },
    ],
  },
];

export const allGeneralFaqs: FAQ[] = faqGroups.flatMap((g) => g.faqs);
/** Shown on the homepage */
export const homepageFaqs: FAQ[] = [
  faqGroups[0].faqs[0],
  faqGroups[0].faqs[1],
  faqGroups[1].faqs[1],
  faqGroups[2].faqs[0],
  faqGroups[2].faqs[1],
  faqGroups[3].faqs[0],
];
