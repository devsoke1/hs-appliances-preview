import type { Service } from "../types";

export const dishwasher: Service = {
  slug: "dishwasher-repair",
  name: "Dishwasher",
  title: "Dishwasher Repair",
  category: "domestic",
  legacyPath: "/dishwasher/",
  shortDescription:
    "Dishwasher repair and installation — not draining, poor cleaning, leaks, not heating or drying, and error codes on freestanding and integrated machines.",
  intro: [
    "A dishwasher that leaves dirty plates, won't drain or stops halfway through a cycle quickly turns a time-saver into a chore. Behind most faults is one of a few parts: the drain pump, the wash (circulation) pump, the heating element, the spray arms, the filters, the inlet valve or the electronic controller. Some faults are simple blockages, and others are a part that has worn out.",
    "We repair freestanding, integrated and slimline dishwashers for homes across Feltham and West London, and we install new machines too. We'll diagnose the fault and explain it in plain terms before carrying out any repair.",
  ],
  faults: [
    {
      name: "Not draining",
      detail:
        "Standing water in the base usually comes from a clogged filter, a kinked or blocked waste hose, a blocked sink connection or a drain pump that has seized or failed.",
    },
    {
      name: "Dishes not coming out clean",
      detail:
        "Blocked spray arm holes, a dirty filter, a weak wash pump, low water intake or a heating fault can all leave food residue and a gritty film on dishes.",
    },
    {
      name: "Leaking",
      detail:
        "Water on the floor can come from a worn door seal, a cracked sump, a failed pump seal, a loose hose clamp or too much foam from the wrong detergent.",
    },
    {
      name: "Not heating or drying",
      detail:
        "Cold, wet dishes at the end of a cycle point to a failed heating element or flow heater, a faulty temperature sensor, or a lack of rinse aid.",
    },
    {
      name: "Won't start or stops mid-cycle",
      detail:
        "A faulty door switch, a water supply problem, a tripped anti-flood system or a control fault can prevent a cycle from starting or finishing.",
    },
    {
      name: "Detergent not dispensing",
      detail:
        "If tablets are left in the dispenser, the latch may be sticking or broken, or blocked spray arms may not be reaching the dispenser to dissolve the tablet.",
    },
    {
      name: "Error codes",
      detail:
        "Error codes help us narrow down whether the fault is with water intake, draining, heating or leak detection before we start testing parts.",
    },
  ],
  sections: [
    {
      heading: "Hard water and your dishwasher",
      paragraphs: [
        "Most of West London has hard water, and limescale is a dishwasher's enemy. It builds up on heating elements, in spray arms and in valves, cutting cleaning performance and shortening the life of parts. Keeping the salt reservoir topped up and setting the water-hardness level correctly in the machine's settings makes a real difference.",
        "Rinse aid isn't optional on most modern machines either — they rely on it to dry dishes at lower temperatures.",
      ],
    },
    {
      heading: "Integrated dishwasher repairs",
      paragraphs: [
        "Integrated machines sit behind a kitchen door panel, and some faults need the machine sliding out of its housing. We disconnect and refit integrated dishwashers carefully, and we check the door springs and hinges too. A worn spring makes the heavy decor door drop open and puts strain on the hinges and the door seal.",
      ],
    },
    {
      heading: "Simple maintenance that prevents repairs",
      paragraphs: [
        "Clean the filter in the base every week or two — it takes less than a minute. Scrape plates before loading, but there's no need to pre-rinse. Once a month, run an empty hot cycle with a dishwasher cleaner, and check the spray arms spin freely and their holes aren't blocked.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why won't my dishwasher drain?",
      answer:
        "Usually a blocked filter, a blocked waste hose or sink connection, or a faulty drain pump. Cleaning the filter is a good first check. If that doesn't help, we can diagnose it.",
    },
    {
      question: "Why are my dishes still dirty after a cycle?",
      answer:
        "Blocked spray arms, a clogged filter, a weak circulation pump or a heating fault are the usual culprits. Hard water and the wrong detergent can contribute too.",
    },
    {
      question: "Why is there white residue on my glasses?",
      answer:
        "Often it's limescale from hard water. Check the salt reservoir is full and the hardness setting is correct. If it persists, the water softener unit in the machine may need attention.",
    },
    {
      question: "Do you repair integrated dishwashers?",
      answer: "Yes — integrated, freestanding and slimline models.",
    },
    {
      question: "Can you install a new dishwasher?",
      answer:
        "Yes, including connecting the water supply and waste and fitting integrated machines into an existing housing. [CONFIRM: whether you fit decor panels.]",
    },
  ],
};
