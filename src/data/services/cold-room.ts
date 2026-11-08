import type { Service } from "../types";
import { FGAS_NOTE } from "./compliance";

export const coldRoom: Service = {
  slug: "cold-room-repair",
  name: "Cold Room",
  title: "Cold Room Repair & Maintenance",
  category: "commercial",
  legacyPath: "/refrigeration-cold-room/",
  complianceNote: FGAS_NOTE,
  shortDescription:
    "Walk-in cold room and freezer room repairs and maintenance for restaurants, takeaways, shops and food businesses.",
  intro: [
    "For a restaurant, takeaway, butcher or food shop, the cold room holds most of the stock. When it starts running warm, you're looking at a food safety problem, a stock-loss problem and possibly a trading problem all at once. In England, chilled food must by law be kept at 8°C or below, and most businesses aim for 5°C or lower. A cold room that can't hold that needs attention fast.",
    "We diagnose and repair walk-in chillers and freezer rooms for businesses across Feltham and West London. We trace the fault through the whole system — condensing unit, evaporator, controls, door and defrost — and explain clearly what's wrong and what it will take to fix.",
  ],
  faults: [
    {
      name: "Not holding temperature",
      detail:
        "A cold room creeping up in temperature can be caused by a dirty condenser, a failing compressor or fan, an iced evaporator, a controller fault, a refrigerant leak or a door left ajar.",
    },
    {
      name: "Evaporator icing up",
      detail:
        "Ice building on the evaporator coil inside the room usually means a defrost fault — a heater, timer, controller setting or drain-line problem — or warm, humid air getting in.",
    },
    {
      name: "Compressor short-cycling or not starting",
      detail:
        "A compressor that keeps starting and stopping, or won't run at all, may have an electrical fault, a pressure switch tripping or an overheating problem caused by poor condenser airflow.",
    },
    {
      name: "Door seals and heaters",
      detail:
        "Damaged door gaskets, a door that doesn't close by itself or a failed door-frame heater on a freezer room let warm air and moisture in, causing ice and high running costs.",
    },
    {
      name: "Alarm or controller faults",
      detail:
        "High-temperature alarms, faulty probes and controllers with the wrong settings can cause false alarms or, worse, hide a real temperature problem.",
    },
    {
      name: "Water leaking inside",
      detail:
        "A blocked or frozen evaporator drain line can send defrost water onto the floor or stock — a slip hazard as well as a hygiene issue.",
    },
  ],
  sections: [
    {
      heading: "How a cold room system works",
      paragraphs: [
        "A typical cold room has an evaporator unit inside, which blows cold air through the room, and a condensing unit outside or in a plant area, which rejects the heat. Between them are the refrigerant pipework and an expansion valve, and an electronic controller that manages temperature and defrost cycles.",
        "A fault in any one of those can show up as the same symptom — a room that won't hold temperature. That's why systematic diagnosis matters.",
      ],
    },
    {
      heading: "Planned maintenance",
      paragraphs: [
        "Most cold room breakdowns build up over time. A condenser clogged with grease and dust makes the compressor work harder. Drain lines block, door seals tear and defrost settings drift.",
        "Routine maintenance — cleaning coils, checking electrical connections, testing defrost operation, inspecting seals and verifying controller probes — catches these problems before they turn into a breakdown on a busy Friday. [CONFIRM: describe any maintenance plans you offer.]",
      ],
    },
    {
      heading: "If your cold room fails",
      paragraphs: [
        "Keep the door closed and record the temperature and the time. Move high-risk stock to other refrigeration if you can, and call us. Keeping a written record of temperatures and the actions you took supports your food safety management system and any conversation with your environmental health officer.",
      ],
    },
  ],
  faqs: [
    {
      question: "What should I do if my cold room stops cooling?",
      answer:
        "Keep the door closed, record the temperature, move high-risk stock to other refrigeration if possible and call us straight away.",
    },
    {
      question: "What temperature should a cold room be?",
      answer:
        "Chilled food must legally be kept at 8°C or below in England, and most businesses run chillers between 0°C and 5°C. Freezer rooms typically run at -18°C or colder.",
    },
    {
      question: "Do you work on walk-in freezers as well as chillers?",
      answer: "Yes — both walk-in chillers and freezer rooms.",
    },
    {
      question: "Do you offer planned maintenance for cold rooms?",
      answer: "[CONFIRM: describe your maintenance offering.]",
    },
  ],
};
