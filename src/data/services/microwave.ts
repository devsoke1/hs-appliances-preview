import type { Service } from "../types";

export const microwave: Service = {
  slug: "microwave-repair",
  name: "Microwave",
  title: "Microwave Repair",
  category: "domestic",
  legacyPath: "/microwave/",
  shortDescription:
    "Microwave and combination oven repairs — not heating, turntable faults, sparking, door and touch-panel problems on built-in and freestanding models.",
  intro: [
    "Microwaves look simple, but inside is a high-voltage circuit — a transformer, a capacitor, a diode and the magnetron that produces the microwaves. The capacitor can hold a dangerous charge even after the plug is pulled. That's why microwave repairs should only be done by someone trained to discharge and test these parts safely.",
    "We repair built-in microwaves, combination microwave ovens and higher-end freestanding models for homes across Feltham and West London. For basic freestanding microwaves, we'll be upfront if a replacement makes more sense than a repair.",
  ],
  faults: [
    {
      name: "Runs but doesn't heat",
      detail:
        "The light comes on and the turntable spins, but food stays cold. This usually points to the magnetron, high-voltage diode, capacitor or a door switch fault.",
    },
    {
      name: "Turntable not turning",
      detail:
        "Check the roller ring and coupler are seated properly. If they are, the small turntable motor underneath may have failed.",
    },
    {
      name: "Sparking or arcing",
      detail:
        "Metal in the cavity, a damaged or greasy waveguide cover, or chipped interior paint can cause sparking. Stop using it until it's been checked.",
    },
    {
      name: "Won't start or door problems",
      detail:
        "Microwaves use several door interlock switches for safety. If any fail, or the door latch is damaged, the oven won't start or may blow its internal fuse.",
    },
    {
      name: "Touch panel unresponsive",
      detail:
        "Moisture, a worn membrane keypad or a control board fault can make buttons stop working, work intermittently or trigger the wrong functions.",
    },
    {
      name: "Blowing fuses or tripping",
      detail:
        "A microwave that blows its fuse or trips the electrics may have a failed door switch, a shorted component in the high-voltage circuit or a wiring fault.",
    },
  ],
  sections: [
    {
      heading: "Why microwave repairs aren't DIY",
      paragraphs: [
        "The high-voltage capacitor inside a microwave can store a charge that's lethal, and it doesn't always discharge when the plug is pulled. Door switches and seals also play a critical role in keeping microwave energy inside the cavity.",
        "After any repair we check the door closes, latches and seals correctly, so the oven is safe to use as well as working again.",
      ],
    },
    {
      heading: "Built-in and combination microwaves",
      paragraphs: [
        "Built-in and combination microwaves — the kind that also grill and bake using a convection element — cost considerably more than countertop models and are fitted into kitchen units. That usually makes a repair the sensible choice.",
        "The grill element, convection fan and combination controls add a few more possible faults, all of which we can test.",
      ],
    },
    {
      heading: "Repair or replace — an honest view",
      paragraphs: [
        "A new magnetron or control board can cost more than a basic freestanding microwave is worth. We'll tell you when that's the case rather than carrying out a repair that doesn't make financial sense.",
        "For built-in and combination models, most faults are usually worth repairing.",
      ],
    },
    {
      heading: "Simple care tips",
      paragraphs: [
        "Never run a microwave empty, keep metal out of the cavity and wipe splashes off the waveguide cover (the small panel on the inside wall). To loosen stubborn grime, heat a bowl of water with lemon juice for a few minutes, then wipe the inside clean.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is it worth repairing a microwave?",
      answer:
        "Built-in and combination microwaves are often worth repairing. For basic freestanding models, replacement may be cheaper — we'll tell you honestly.",
    },
    {
      question: "Why is my microwave running but not heating?",
      answer:
        "Usually a failed magnetron, high-voltage diode or capacitor, or a faulty door switch. These parts carry high voltage and should only be tested by a trained engineer.",
    },
    {
      question: "Why is my microwave sparking?",
      answer:
        "Often metal in the cavity, a damaged waveguide cover or a build-up of food residue. Stop using it until it's been checked.",
    },
    {
      question: "Can I keep using my microwave if the door is damaged?",
      answer:
        "No. The door, its seal and its interlock switches keep microwave energy inside the oven. A damaged door should be repaired before the microwave is used again.",
    },
    {
      question: "Do you repair built-in microwaves?",
      answer: "Yes, including built-in combination microwave ovens.",
    },
  ],
};
