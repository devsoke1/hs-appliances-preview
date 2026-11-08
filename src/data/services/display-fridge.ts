import type { Service } from "../types";
import { FGAS_NOTE } from "./compliance";

export const displayFridge: Service = {
  slug: "display-fridge-repair",
  name: "Display Fridge",
  title: "Display Fridge Repair",
  category: "commercial",
  legacyPath: "/display-fridge/",
  complianceNote: FGAS_NOTE,
  shortDescription:
    "Commercial display fridge repairs — glass-door drinks merchandisers, serve-over counters, cake and deli displays.",
  intro: [
    "Display fridges do two jobs at once: they keep stock at a safe temperature, and they keep it looking good enough to sell. A merchandiser with misted-up doors, a serve-over counter that's running warm or a cake display with failed lighting affects your takings as well as your food safety records.",
    "We repair upright glass-door merchandisers, serve-over deli and butcher counters, patisserie and cake displays, and countertop chillers for cafés, shops, restaurants and takeaways across Feltham and West London. We'll find the fault, explain it, and quote before carrying out the repair.",
  ],
  faults: [
    {
      name: "Not cooling to temperature",
      detail:
        "A dirty condenser, a failed fan, a faulty thermostat or controller, an iced evaporator or a refrigerant leak can all leave a display fridge running warm.",
    },
    {
      name: "Condensation on glass",
      detail:
        "Doors misting up — inside or out — usually points to high humidity, a worn door gasket, or a failed glass or frame heater on models that have them.",
    },
    {
      name: "Ice on the back wall",
      detail:
        "Ice forming on the rear panel or around the evaporator suggests a defrost problem, a door that isn't closing, or stock pressed against the evaporator.",
    },
    {
      name: "Fan or lighting failure",
      detail:
        "Failed evaporator fans cause warm spots, and failed LED lighting makes the display look closed. Both are usually straightforward to replace.",
    },
    {
      name: "Doors not closing",
      detail:
        "Worn hinges, broken self-closing mechanisms and damaged gaskets let doors drift open, which wastes energy and lets warm air in.",
    },
    {
      name: "Controller faults",
      detail:
        "Incorrect set-points, faulty probes or a failing controller can make temperatures swing or set off false alarms.",
    },
  ],
  sections: [
    {
      heading: "Glass-door merchandisers",
      paragraphs: [
        "Upright drinks and food merchandisers are often placed near entrances or windows, where sunlight and draughts make them work harder. Most have a fan-assisted evaporator at the top or back and a condenser at the bottom that pulls in air from the front grille.",
        "When that grille gets clogged with dust, cooling performance drops and the compressor runs for longer.",
      ],
    },
    {
      heading: "Serve-over counters",
      paragraphs: [
        "Serve-over counters used by delis, butchers and fishmongers can be fan-assisted or static (gravity) cooled. Static counters keep fresh produce from drying out, but they're more sensitive to how they're loaded and to warm air around them.",
        "We check the cooling system, the controls, the lighting and the glass to keep the counter at temperature and looking right.",
      ],
    },
    {
      heading: "Keeping display fridges reliable",
      paragraphs: [
        "Clean the condenser grille regularly, keep the area around the fridge clear for airflow, don't block internal air vents with stock, and check door gaskets for splits.",
        "Keeping a simple daily temperature log also helps spot a problem early, before it becomes a breakdown.",
      ],
    },
    {
      heading: "Cake and patisserie displays",
      paragraphs: [
        "Cake displays have to keep cream, custard and fruit products cold while staying clear enough to show them off. That means a balance between cooling and humidity: too dry and products crust over, too humid and the glass mists up.",
        "Faults with fans, heaters, lighting and controllers all affect that balance. Curved-glass units also need careful handling when panels are removed for access, and we take that care when working on them.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why is my display fridge door misting up?",
      answer:
        "Usually high humidity, a failing door seal or a faulty door heater. Persistent misting should be checked.",
    },
    {
      question: "What temperature should a display fridge run at?",
      answer:
        "Chilled food must legally be kept at 8°C or below in England. Many businesses aim for 5°C or below to give a safety margin.",
    },
    {
      question: "Do you repair serve-over counters?",
      answer: "Yes, as well as upright glass-door merchandisers and cake displays.",
    },
    {
      question: "Can you get parts for older models?",
      answer:
        "We'll source parts where they're available, and tell you honestly if a unit is no longer worth repairing.",
    },
  ],
};
