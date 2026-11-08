import type { Service } from "../types";
import { FGAS_NOTE } from "./compliance";

export const barCooler: Service = {
  slug: "bar-cooler-repair",
  name: "Bar Cooler",
  title: "Bar Cooler Repair",
  category: "commercial",
  legacyPath: "/bar-cooler/",
  complianceNote: FGAS_NOTE,
  shortDescription:
    "Back-bar bottle cooler repairs for pubs, bars, clubs and restaurants — warm drinks, constant running, noisy fans, door and lighting faults.",
  intro: [
    "Back-bar bottle coolers live a hard life. They're usually squeezed under a counter with little room to breathe, surrounded by heat from glasswashers, lighting and people, and opened hundreds of times on a busy night. It's no surprise they're one of the most common pieces of bar equipment to fail — and warm drinks on a Friday night are bad for business.",
    "We repair single, double and triple-door back-bar coolers, with hinged or sliding doors, for pubs, bars, clubs, restaurants and hotels across Feltham and West London. We'll get to the cause of the problem and advise honestly on whether a unit is worth repairing.",
  ],
  faults: [
    {
      name: "Drinks not cold enough",
      detail:
        "The usual causes are a clogged condenser, blocked ventilation, a failed condenser or evaporator fan, a faulty thermostat or a refrigerant leak.",
    },
    {
      name: "Running constantly",
      detail:
        "A cooler that never cycles off is struggling to reject heat. That's often down to dirt, poor airflow under the bar, or doors and seals letting warm air in.",
    },
    {
      name: "Noisy fan or compressor",
      detail:
        "Rattling or grinding often means a worn fan motor or a fan blade catching. A loud compressor may be working too hard or failing.",
    },
    {
      name: "Doors not closing or worn seals",
      detail:
        "Sliding door runners wear, hinges and self-closers fail and gaskets split, letting cold air out every time the bar is busy.",
    },
    {
      name: "Lighting not working",
      detail:
        "LED strips and drivers fail over time. Bottle coolers are as much about display as cooling, so dark shelves affect sales.",
    },
  ],
  sections: [
    {
      heading: "Heat and ventilation behind the bar",
      paragraphs: [
        "Most bar coolers are designed to draw air in and blow it out through the front grille, so they can sit tight under a counter. If that grille is blocked by kick boards, crates or a build-up of dust, the condenser can't get rid of heat, and the cooler runs warm and wears out early.",
        "Some models need space at the back or sides instead. Fitting a cooler that doesn't suit the space is a common cause of repeated breakdowns, and we'll point it out if we see it.",
      ],
    },
    {
      heading: "Hinged vs. sliding doors",
      paragraphs: [
        "Sliding doors save space in narrow bars, but their runners, rollers and brushes wear out. Hinged doors seal well but depend on gaskets and self-closing hinges in good condition. Either way, worn door parts are often a cheap fix that makes a noticeable difference to cooling and running costs.",
      ],
    },
    {
      heading: "Repair or replace?",
      paragraphs: [
        "Fans, thermostats, controllers, lights and door parts are usually well worth replacing. A failed compressor or a refrigerant leak on an older, cheaper cooler may not be. We'll explain the costs either way so you can decide what makes sense for your bar.",
      ],
    },
    {
      heading: "Running costs",
      paragraphs: [
        "Bar coolers often run around the clock, so a struggling unit costs money long before it actually breaks down. A clogged condenser, split door gaskets or a failing fan can all make the compressor run far longer than it should.",
        "Some venues switch coolers off overnight to save energy. If you do, give them enough time to pull back down to temperature before service, and avoid loading them with warm stock just before opening.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why is my bar cooler not getting cold?",
      answer:
        "A dirty condenser, poor ventilation behind the bar, a failed fan or a thermostat fault are the most common causes.",
    },
    {
      question: "How can I help my bar cooler last longer?",
      answer:
        "Keep the front grille clear and clean, avoid stacking crates against it, don't overload the shelves, and have the condenser cleaned regularly.",
    },
    {
      question: "Do you repair glass-door and solid-door bar coolers?",
      answer: "Yes, both — hinged and sliding door models.",
    },
    {
      question: "Can you come outside of opening hours?",
      answer: "[CONFIRM: state whether you offer early, late or out-of-hours visits for pubs and bars.]",
    },
  ],
};
