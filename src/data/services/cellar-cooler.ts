import type { Service } from "../types";
import { FGAS_NOTE } from "./compliance";

export const cellarCooler: Service = {
  slug: "cellar-cooler-repair",
  name: "Cellar Cooler",
  title: "Cellar Cooler Repair",
  category: "commercial",
  legacyPath: "/celler-cooler/",
  complianceNote: FGAS_NOTE,
  shortDescription:
    "Beer cellar cooling repairs for pubs and bars — cellars running warm, iced evaporators, condensing unit and fan faults.",
  intro: [
    "Beer quality starts in the cellar. Cask ale in particular needs a steady cellar temperature — industry guidance commonly gives 11–13°C — to condition properly and serve well. A cellar that drifts too warm quickly leads to fobbing, hazy or flat beer and wasted product. And because the cellar is out of sight, a failing cooling system often isn't noticed until customers start complaining.",
    "We repair cellar cooling systems for pubs, bars, clubs and restaurants across Feltham and West London. We diagnose evaporators, condensing units, fans and controllers, and explain the fault and the fix before starting work.",
  ],
  faults: [
    {
      name: "Cellar running warm",
      detail:
        "A dirty or obstructed condensing unit, a failed fan, a controller fault, a refrigerant leak or a cellar door left open can all push the temperature up.",
    },
    {
      name: "Evaporator icing up",
      detail:
        "Ice on the cellar cooler coil restricts airflow and cooling. It usually points to low airflow, a defrost issue, a dirty coil or low refrigerant.",
    },
    {
      name: "Condensing unit not starting",
      detail:
        "Electrical faults, failed contactors or capacitors, tripped pressure switches or an overheating compressor can stop the outdoor unit running.",
    },
    {
      name: "Fan not running",
      detail:
        "If the evaporator fan in the cellar fails, cold air stops circulating even when the condensing unit is running, so the cellar warms up.",
    },
    {
      name: "Water leaking from the evaporator",
      detail:
        "A blocked condensate drain or tray can cause the cooler to drip onto barrels, gas bottles or the cellar floor.",
    },
  ],
  sections: [
    {
      heading: "How cellar cooling works",
      paragraphs: [
        "Most pub cellars use a split system: an evaporator unit mounted in the cellar, connected to a condensing unit outside — often in a yard, a light well or on a wall. Through-the-wall units combine both parts in one.",
        "Either way, the system relies on clean coils, working fans and a reasonably sealed, insulated cellar to hold a stable temperature.",
      ],
    },
    {
      heading: "Heat load and busy periods",
      paragraphs: [
        "Cellar cooling has more to cope with than outside temperature. Beer line coolers and ice-bank chillers often sit in or near the cellar and give off heat. Deliveries mean the doors are opened for long periods, and summer heat makes the condensing unit work harder.",
        "A system that copes in spring can struggle in July, which is why maintenance before summer is a good idea.",
      ],
    },
    {
      heading: "Looking after your cellar cooler",
      paragraphs: [
        "Keep the outdoor unit free of leaves, litter and anything stacked against it. Keep cellar doors and hatches closed, and avoid storing cardboard and clutter in front of the evaporator.",
        "If you notice ice on the cooler, water dripping or the temperature creeping up, get it looked at early rather than waiting for it to fail.",
      ],
    },
    {
      heading: "Early warning signs",
      paragraphs: [
        "Cellar cooling rarely fails without warning. Watch out for the cellar thermometer creeping up through the day, ice forming on the evaporator fins, water dripping from the unit, the condensing unit outside running constantly or cycling on and off rapidly, and beer that starts fobbing at the tap even though nothing else has changed.",
        "Any of these is a good reason to have the system checked before a hot weekend turns a minor fault into lost stock.",
      ],
    },
  ],
  faqs: [
    {
      question: "What temperature should a beer cellar be?",
      answer:
        "Cask ale cellars are commonly kept around 11–13°C. Check your brewer's guidance for your products.",
    },
    {
      question: "Why is my cellar cooler icing up?",
      answer: "Low airflow, a defrost problem, a dirty coil or a refrigerant issue are the usual causes.",
    },
    {
      question: "Do you repair beer line coolers and python chillers?",
      answer: "[CONFIRM: state whether you work on beer line cooling / ice-bank chillers, or cellar cooling only.]",
    },
    {
      question: "Do you service cellar cooling systems?",
      answer: "Yes — regular servicing helps catch problems early. [CONFIRM: maintenance offering.]",
    },
  ],
};
