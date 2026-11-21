import type { Service } from "../types";

export const tumbleDryer: Service = {
  slug: "tumble-dryer-repair",
  name: "Tumble Dryer",
  title: "Tumble Dryer Repair",
  category: "domestic",
  legacyPath: "/tumble-dryer/",
  shortDescription:
    "Tumble dryer repair for vented, condenser and heat-pump machines — not heating, not tumbling, long cycles, noise and door faults.",
  intro: [
    "A tumble dryer that runs cold, takes hours to finish or stops mid-cycle leaves washing sitting wet. Most faults come down to the heater or heat pump, the drum belt or motor, the thermostat, the door switch, or a blocked filter and condenser.",
    "We repair freestanding and integrated tumble dryers, including condenser and heat-pump models, in homes across Feltham and West London. We find the failed part before any work is agreed.",
  ],
  faults: [
    {
      name: "Not heating",
      detail:
        "The drum turns but the clothes stay damp. On a vented or condenser dryer this is often the element, thermostat or thermal cut-out. On a heat-pump dryer it can be the compressor or a sensor.",
    },
    {
      name: "Not tumbling",
      detail:
        "A snapped or slack drum belt, a worn motor or a failed capacitor will stop the drum turning. A jammed drum bearing can do the same and is usually noisy first.",
    },
    {
      name: "Taking too long to dry",
      detail:
        "A blocked fluff filter, a packed condenser or a crushed vent hose makes the machine run for hours. A weak heater or a failing heat pump has the same result.",
    },
    {
      name: "Noisy",
      detail:
        "A thump once per turn is often a worn drum roller or a foreign object. A squeal is more often the belt, a roller or the motor bearing.",
    },
    {
      name: "Will not start",
      detail:
        "Check the door is shut. If it still will not start, the door switch, the start switch or the main board may have failed.",
    },
    {
      name: "Leaking or heavy condensation",
      detail:
        "Condenser dryers leak when the condenser, pump or water container is blocked or cracked. The machine should be level, and the container seated properly.",
    },
  ],
  sections: [
    {
      heading: "Vented, condenser and heat pump",
      paragraphs: [
        "A vented dryer pushes moist air outside through a hose. A condenser dryer collects that water in a tank or a drain hose. A heat-pump dryer reuses the heat and uses less electricity, but the sealed system needs proper testing if it stops drying.",
        "Tell us which type you have when you book. The model plate is usually inside the door.",
      ],
    },
    {
      heading: "Keeping it drying properly",
      paragraphs: [
        "Clean the fluff filter after every load. On a condenser or heat-pump dryer, rinse the condenser or filter on the schedule in the manual. A blocked airway is the most common reason a dryer takes longer and longer.",
        "Do not dry items that have been cleaned with flammable solvents, and do not leave the machine running when nobody is in.",
      ],
    },
  ],
  faqs: [
    {
      question: "The drum turns but the clothes stay wet. What is wrong?",
      answer:
        "The drum drive is working, so the fault is usually heat or airflow: the element, a thermostat, a blocked filter or condenser, or the heat pump on a heat-pump model.",
    },
    {
      question: "Do you repair washer-dryers as well as tumble dryers?",
      answer: "Yes. Washer-dryer drying faults are covered with washing machine repairs. This page is for separate tumble dryers.",
    },
    {
      question: "Is it worth repairing an older dryer?",
      answer:
        "Often yes, when the fault is a belt, element, switch or pump. After we have diagnosed it we will tell you if a repair is worth it before any work starts.",
    },
  ],
};
