import type { Service } from "../types";

export const electricHob: Service = {
  slug: "electric-hob-repair",
  name: "Electric Hob",
  title: "Electric & Induction Hob Repair",
  category: "domestic",
  legacyPath: "/electric-hob/",
  shortDescription:
    "Ceramic, induction and solid-plate hob repairs — zones not heating, unresponsive touch controls, pan detection faults and error codes.",
  intro: [
    "Electric hobs come in several types — ceramic (radiant), halogen, induction and traditional solid plate — and each fails in its own ways. A ceramic zone that won't glow red is usually an element or energy regulator problem. An induction hob that beeps and shows an error, or won't recognise your pans, more often points to a generator board, coil or cooling fan.",
    "We repair all types of electric hob for homes across Feltham and West London. We'll work out whether the fault is in a single zone, the control electronics or the power supply, explain it clearly, and quote before carrying out the repair.",
  ],
  faults: [
    {
      name: "One or more zones not heating",
      detail:
        "On ceramic hobs this is often a failed radiant element or energy regulator. On induction hobs it's more likely a coil, a generator board or a connection between them.",
    },
    {
      name: "Touch controls not responding",
      detail:
        "Water, grease or a pan resting on the control area can confuse touch sensors. If cleaning doesn't help, the touch control board itself may have failed.",
    },
    {
      name: "Induction not detecting pans",
      detail:
        "Induction needs magnetic cookware with a flat base. If suitable pans aren't recognised, the coil, its temperature sensor or the generator may be faulty.",
    },
    {
      name: "Error codes or beeping",
      detail:
        "Induction hobs protect themselves when they sense overheating, power problems or internal faults. The code helps us pinpoint the part responsible.",
    },
    {
      name: "Hob tripping the electrics",
      detail:
        "A shorted element, a damaged terminal block or a failed power board can trip the breaker or RCD as soon as the hob is turned on.",
    },
    {
      name: "Cracked or chipped glass",
      detail:
        "A crack in a ceramic or induction top is a safety issue. Replacing the glass means fitting a new top panel, which is available for many — but not all — models.",
    },
  ],
  sections: [
    {
      heading: "How induction hobs differ",
      paragraphs: [
        "Induction hobs heat the pan directly using a magnetic field from copper coils under the glass, driven by power electronics called generator boards. Because those electronics produce heat, a cooling fan underneath keeps them within safe limits. If the fan fails or the ventilation gap under the hob is blocked, the hob may shut down or show overheating errors.",
        "A faulty induction hob isn't necessarily a write-off. Individual boards, coils and fans can often be replaced.",
      ],
    },
    {
      heading: "If the glass is cracked",
      paragraphs: [
        "Stop using the hob and switch it off at the isolator. A cracked top can let spills reach live parts underneath. We'll check whether a replacement top is available for your model and whether it's worth fitting compared with a new hob.",
      ],
    },
    {
      heading: "Looking after a glass hob",
      paragraphs: [
        "Wipe up sugary spills promptly, as they can pit the glass when they burn on. Use a proper hob scraper and cleaner rather than abrasive pads, and lift pans rather than sliding them.",
        "For induction hobs, keep the ventilation space underneath clear. Avoid storing items in a drawer directly under the hob that could block the airflow.",
      ],
    },
  ],
  faqs: [
    {
      question: "Can I use my hob if the glass is cracked?",
      answer:
        "No — switch it off at the isolator. A cracked glass top can expose live parts and should be replaced before you use it again.",
    },
    {
      question: "Why won't my induction hob recognise my pan?",
      answer:
        "Induction needs magnetic cookware with a flat base. Test your pan with a fridge magnet. If suitable pans aren't detected, the fault may be a sensor, coil or control board.",
    },
    {
      question: "Why does my induction hob keep switching off?",
      answer:
        "It may be overheating because of a failed cooling fan or blocked ventilation, or it may be detecting a power or internal fault. An error code helps us diagnose it quickly.",
    },
    {
      question: "Do you repair induction hobs?",
      answer: "Yes — induction, ceramic, halogen and solid-plate electric hobs.",
    },
  ],
};
