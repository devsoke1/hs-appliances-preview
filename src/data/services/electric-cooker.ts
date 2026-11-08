import type { Service } from "../types";

export const electricCooker: Service = {
  slug: "electric-cooker-repair",
  name: "Electric Cooker",
  title: "Electric Cooker & Oven Repair",
  category: "domestic",
  legacyPath: "/electric-cooker/",
  shortDescription:
    "Electric cooker and oven repairs — not heating, uneven cooking, fan faults, grills, tripping electrics and broken timers or controls.",
  intro: [
    "An oven that won't heat up, burns food on one side or trips the electrics as soon as it's switched on is more than an inconvenience. Electric ovens are fairly simple machines at heart — heating elements, a fan, a thermostat, a selector switch, a thermal cut-out and a timer or control board — so most faults can be traced to a specific part that's often available to replace.",
    "We repair freestanding electric cookers, built-in single and double ovens and range-style cookers for homes across Feltham and West London. Every repair starts with safe isolation and proper testing, so we fix the real cause instead of swapping parts until the problem goes away.",
  ],
  faults: [
    {
      name: "Oven not heating",
      detail:
        "In a fan oven, the circular element behind the fan cover is the most common failure. A faulty thermostat, selector switch, thermal cut-out or timer can also stop the oven heating.",
    },
    {
      name: "Uneven cooking or burning",
      detail:
        "If food burns on one side or the oven runs much hotter than the dial says, the thermostat may be out of calibration, or the fan may be running slowly or not at all.",
    },
    {
      name: "Fan not working or noisy",
      detail:
        "A worn fan motor bearing causes grinding or squealing. A failed motor means the oven heats unevenly and may trip its safety cut-out.",
    },
    {
      name: "Tripping the electrics",
      detail:
        "An element that has failed to earth is the usual reason an oven trips the circuit breaker or RCD. Damaged wiring or moisture in the terminal block are other causes.",
    },
    {
      name: "Grill not working",
      detail:
        "A blown grill element, a faulty grill control or a selector switch fault will stop the grill heating while the main oven still works.",
    },
    {
      name: "Timer, clock or controls",
      detail:
        "Many ovens won't heat until the clock has been set or the timer is in manual mode. If the controls are unresponsive, the clock module or control board may have failed.",
    },
    {
      name: "Door seal or hinge damage",
      detail:
        "A loose or perished door seal lets heat escape, so food cooks slowly and the controls and the front of the cooker get hotter than they should.",
    },
  ],
  sections: [
    {
      heading: "Why the fan oven element fails",
      paragraphs: [
        "In a fan oven, the element wraps around the fan behind the back panel. It works hard, heating up and cooling down every time the oven is used, and eventually it breaks or shorts to earth. When it shorts, the oven usually trips the electrics. When it breaks, the fan runs but the oven stays cold.",
        "Replacing the element is one of the most common oven repairs we do, and it's usually well worth doing.",
      ],
    },
    {
      heading: "Electric cookers and safety",
      paragraphs: [
        "Most electric cookers are hard-wired to a dedicated high-current circuit with its own isolator switch on the wall. That's why oven repairs aren't a good DIY job. The cooker must be safely isolated and tested before any panels come off.",
        "If your oven trips the electrics, switch it off at the cooker isolator and leave it off until it's been checked.",
      ],
    },
    {
      heading: "Getting the best from your oven",
      paragraphs: [
        "Don't line the oven floor with foil — it blocks airflow and can damage the enamel and the bottom element. Clean the door seal gently, and keep harsh oven cleaners away from the seal, the fan and the control panel.",
        "If your oven has a pyrolytic self-clean function, follow the manual and remove the shelves and runners first.",
      ],
    },
  ],
  faqs: [
    {
      question: "My oven trips the electrics. Is it safe to use?",
      answer:
        "No. Switch it off at the isolator and don't use it until it's been checked. Tripping usually points to a failed element or a wiring fault.",
    },
    {
      question: "Why does my fan run but the oven doesn't heat?",
      answer:
        "This is the classic sign of a failed fan oven element. It can also be a thermal cut-out or thermostat fault, so we test before replacing anything.",
    },
    {
      question: "Why won't my oven work until I set the clock?",
      answer:
        "On many ovens the timer controls the heating. After a power cut, the clock may need resetting or switching back to manual mode before the oven will heat.",
    },
    {
      question: "Do you repair built-in ovens?",
      answer: "Yes — built-in single and double ovens as well as freestanding and range cookers.",
    },
    {
      question: "Can you install a new electric cooker?",
      answer:
        "Yes. [CONFIRM: state whether you connect hard-wired cookers to an existing cooker point, and any electrical qualifications you hold.]",
    },
  ],
};
