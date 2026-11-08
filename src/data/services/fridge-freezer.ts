import type { Service } from "../types";

export const fridgeFreezer: Service = {
  slug: "fridge-freezer-repair",
  name: "Fridge Freezer",
  title: "Fridge Freezer Repair",
  category: "domestic",
  legacyPath: "/fridge-freezer/",
  shortDescription:
    "Fridge, freezer and fridge freezer repairs — not cooling, icing up, water inside, running constantly and noisy operation.",
  intro: [
    "When a fridge freezer stops keeping food cold, the clock starts ticking. Food safety guidance is to keep a fridge at 5°C or below and a freezer at around -18°C. Once those temperatures slip, chilled food can become unsafe surprisingly quickly. The most common causes are electrical rather than catastrophic: a failed thermostat or temperature sensor, a fan that has stopped, a fault in the defrost system, a worn door seal or a faulty compressor start relay.",
    "We repair freestanding and integrated fridges, freezers and fridge freezers, including frost-free models, for homes across Feltham and West London. We test the system to find out why it isn't cooling, explain what we've found and talk you through your options before doing any work.",
  ],
  faults: [
    {
      name: "Not cooling",
      detail:
        "A fridge that has gone warm may have a failed thermostat, sensor or control board. It could also have a stopped fan or a compressor that isn't starting. We work out which before recommending anything.",
    },
    {
      name: "Fridge warm, freezer fine",
      detail:
        "In frost-free models the fridge is usually cooled by air from the freezer. If the evaporator ices over or the fan or air damper fails, the freezer keeps working while the fridge warms up.",
    },
    {
      name: "Freezer icing up",
      detail:
        "Heavy frost build-up points to a defrost heater, timer or sensor fault in frost-free models, or warm air getting in past a damaged door seal.",
    },
    {
      name: "Water inside or underneath",
      detail:
        "A blocked defrost drain is the classic cause of water collecting under the salad drawers. A split drain hose or a cracked evaporation tray can let water reach the floor.",
    },
    {
      name: "Running constantly",
      detail:
        "A compressor that never switches off may be struggling because of dirty condenser coils, poor ventilation, a door seal leak or a faulty thermostat.",
    },
    {
      name: "Unusual noises",
      detail:
        "Buzzing, rattling or squealing usually comes from a fan motor, the compressor mounts or an ice build-up touching a fan blade.",
    },
    {
      name: "Door seal problems",
      detail:
        "A split, flattened or loose seal lets warm, humid air in, which causes icing, condensation and a fridge that runs all the time.",
    },
  ],
  sections: [
    {
      heading: "Electrical faults vs. sealed-system faults",
      paragraphs: [
        "Most fridge freezer faults are on the electrical side — thermostats, sensors, fans, defrost parts, relays and control boards. These are usually straightforward to replace, and often well worth doing.",
        "Faults inside the sealed refrigeration system, such as a refrigerant leak or a compressor that has failed, are a different matter. They need specialist work and can cost more than a domestic appliance is worth. If that's where the fault is, we'll say so plainly and help you decide whether to repair or replace.",
      ],
    },
    {
      heading: "What to do while you wait for a repair",
      paragraphs: [
        "Keep the doors shut as much as possible — a closed freezer holds its temperature for a good while. Move the highest-risk foods (meat, fish, dairy, cooked leftovers) to a cool box or a neighbour's fridge if you can. If food has been above 8°C for a long period, the safe option is to throw it away.",
      ],
    },
    {
      heading: "Keeping your fridge freezer healthy",
      paragraphs: [
        "Leave a gap behind and above the appliance so heat can escape, and vacuum the condenser coils at the back once or twice a year. Let leftovers cool before putting them in, and don't pack shelves so tightly that air can't circulate.",
        "To check a door seal, close the door on a sheet of paper. If it slides out easily, the seal isn't doing its job.",
      ],
    },
  ],
  faqs: [
    {
      question: "What temperature should my fridge and freezer be?",
      answer: "Keep the fridge between 0°C and 5°C and the freezer at around -18°C. A cheap fridge thermometer is the easiest way to check, as dial settings don't show the actual temperature.",
    },
    {
      question: "My fridge has stopped cooling. What should I do first?",
      answer:
        "Check it's switched on, the temperature setting hasn't been changed and the vents inside aren't blocked by food. Keep the doors closed to hold in the cold, then call us to arrange a diagnosis.",
    },
    {
      question: "Why is there water at the bottom of my fridge?",
      answer:
        "Usually it's a blocked defrost drain, but it can also be a failing door seal or a defrost system fault. It's normally quick to diagnose on site.",
    },
    {
      question: "Why is my fridge warm when the freezer is still freezing?",
      answer:
        "In frost-free models the fridge relies on cold air from the freezer. An iced-up evaporator, a failed fan or a stuck air damper will stop that airflow. It's a common, fixable fault.",
    },
    {
      question: "Do you repair integrated fridge freezers?",
      answer: "Yes, we work on both freestanding and integrated models.",
    },
  ],
};
