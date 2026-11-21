import type { Service } from "../types";

export const oven: Service = {
  slug: "oven-repair",
  name: "Oven",
  title: "Oven Repair",
  category: "domestic",
  legacyPath: "/oven/",
  shortDescription:
    "Built-in and freestanding electric oven repair — not heating, uneven cooking, fan noise, grill faults, tripping electrics and failed controls.",
  intro: [
    "An oven that stays cold, burns one side of the food or trips the electrics is usually a failed element, fan, thermostat, selector or door seal. Those parts are often replaceable, so the oven does not have to be written off.",
    "We repair built-in single and double ovens and freestanding electric ovens for homes across Feltham and West London. The cooker is isolated and tested before any panels come off.",
  ],
  faults: [
    {
      name: "Oven not heating",
      detail:
        "A failed fan element, a thermostat, a selector switch, a thermal cut-out or a timer that is not in manual mode can all leave the oven cold.",
    },
    {
      name: "Uneven cooking",
      detail:
        "Food burning on one side often means the fan is slow or stopped, or the thermostat is out of range.",
    },
    {
      name: "Fan noisy or not running",
      detail:
        "A worn fan motor squeals or grinds. If the fan stops, a fan oven heats unevenly and may cut out.",
    },
    {
      name: "Tripping the electrics",
      detail:
        "An element that has failed to earth is the usual cause. Switch the oven off at the isolator and leave it off until it has been checked.",
    },
    {
      name: "Grill not working",
      detail:
        "A failed grill element or grill control stops the grill while the main oven can still heat.",
    },
    {
      name: "Door not closing or heat escaping",
      detail:
        "A perished seal or a tired hinge lets heat out, so food cooks slowly and the front of the oven gets hotter than it should.",
    },
  ],
  sections: [
    {
      heading: "Built-in ovens",
      paragraphs: [
        "Built-in ovens sit in a housing and are usually on their own circuit, with an isolator above the worktop. The element, fan and thermostat are reached from inside the cavity or from the rear, depending on the make.",
        "Have the make and model ready when you book. It is on a plate around the door frame.",
      ],
    },
    {
      heading: "Using the oven safely",
      paragraphs: [
        "Do not keep using an oven that trips the electrics. Switch it off at the wall isolator.",
        "Do not line the floor of the oven with foil. It blocks the airflow and can damage the enamel and the lower element.",
      ],
    },
  ],
  faqs: [
    {
      question: "My oven trips the fuse. Can I reset it and carry on?",
      answer:
        "No. Switch it off at the isolator and leave it off. Tripping usually means an element or the wiring has failed to earth.",
    },
    {
      question: "Do you repair electric ovens and cookers?",
      answer: "Yes. We repair built-in electric ovens, freestanding electric ovens and electric cookers.",
    },
    {
      question: "The clock is flashing and the oven will not heat. Is that a fault?",
      answer:
        "Often the oven is waiting for the clock to be set, or the timer is not in manual. If it still will not heat once the clock is set, the clock module or the controls may have failed.",
    },
  ],
};
