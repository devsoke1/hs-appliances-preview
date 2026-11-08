import type { Service } from "../types";
import { FGAS_NOTE } from "./compliance";

export const dairyCabinet: Service = {
  slug: "dairy-cabinet-repair",
  name: "Dairy Cabinet",
  title: "Dairy Cabinet Repair",
  category: "commercial",
  legacyPath: "/dairy-cabinet/",
  complianceNote: FGAS_NOTE,
  shortDescription:
    "Multideck dairy cabinet repairs for convenience stores, off-licences and supermarkets — warm cabinets, icing, fans, lighting and night blinds.",
  intro: [
    "Open-front multideck dairy cabinets are the workhorses of convenience stores and supermarkets. They hold milk, cheese, yoghurt, cooked meats and drinks at chilled temperatures with no doors at all. They manage it by blowing a curtain of cold air down the front of the cabinet, and that air curtain is easily disrupted. When it's disturbed, or a part fails, the cabinet warms up quickly and stock is at risk.",
    "We repair multideck dairy cabinets and chilled displays for shops across Feltham and West London. We find out why a cabinet is running warm or icing up, and get it back to a safe temperature.",
  ],
  faults: [
    {
      name: "Cabinet running warm",
      detail:
        "Overloaded shelves blocking the air curtain, an iced evaporator, failed fans, a dirty condenser or a controller fault are the most common causes.",
    },
    {
      name: "Evaporator icing up",
      detail:
        "Ice on the coil at the bottom or back of the cabinet points to a defrost problem, blocked airflow or very humid conditions in the store.",
    },
    {
      name: "Fans not running",
      detail:
        "Multidecks rely on evaporator fans to create the air curtain. One failed fan can leave part of the cabinet noticeably warmer than the rest.",
    },
    {
      name: "Lighting or night blind faults",
      detail:
        "Failed LED strips, drivers or a night blind that won't pull down or retract are common. A missing night blind adds a lot to overnight running costs.",
    },
    {
      name: "Water on the shop floor",
      detail:
        "A blocked drain or a failing condensate evaporator tray can let defrost water spill out — a slip hazard for customers and staff.",
    },
    {
      name: "Noisy compressor or condenser",
      detail:
        "On integral (plug-in) cabinets, a noisy compressor or condenser fan is often a warning sign of a failing bearing or a condenser that's struggling to shed heat.",
    },
  ],
  sections: [
    {
      heading: "Air curtains and load lines",
      paragraphs: [
        "Every multideck has a load line marked on the shelves or sides. Stacking stock past it, or letting packaging hang over the front edge, breaks up the air curtain. Then warm shop air spills in and the cabinet can't keep up.",
        "Before calling for a repair, it's worth checking the cabinet is loaded correctly and the honeycomb grilles at the top and bottom aren't blocked.",
      ],
    },
    {
      heading: "Integral vs. remote cabinets",
      paragraphs: [
        "Integral (plug-in) cabinets have their own compressor and condenser built in and release heat into the shop. Remote cabinets are connected by pipework to a condensing unit outside or in a plant room.",
        "The faults and repairs differ between the two, and we work on both types.",
      ],
    },
    {
      heading: "Night blinds and running costs",
      paragraphs: [
        "Open cabinets lose a lot of cold air overnight when the shop is closed. Night blinds cut that loss considerably, so a broken blind that's been left up is quietly raising your energy bill.",
        "Keeping the condenser coils clean, the blinds working and the fans running all help a cabinet run efficiently.",
      ],
    },
    {
      heading: "Temperature checks and food safety",
      paragraphs: [
        "Chilled food in England must legally be kept at 8°C or below, and most retailers aim lower. Checking cabinet temperatures at least twice a day — and writing them down — helps you spot a cabinet that's starting to struggle and shows that you're managing food safety properly.",
        "If a cabinet is running warm, move high-risk products such as cooked meats and dairy to working refrigeration while you wait for a repair.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why is my dairy cabinet running warm?",
      answer:
        "Air curtains blocked by overfilled shelves, iced evaporators, failed fans or dirty condensers are the common causes. We check each one in turn.",
    },
    {
      question: "Do you repair remote and integral cabinets?",
      answer: "Yes, both types.",
    },
    {
      question: "My cabinet is leaking water onto the floor — what causes that?",
      answer:
        "Usually a blocked drain or a fault with the condensate evaporator tray. Put a warning sign out, mop the area and call us to clear and check it.",
    },
    {
      question: "Can you help keep cabinets running efficiently?",
      answer:
        "Yes. Regular condenser cleaning, and checks on seals, blinds, fans and controllers, help both efficiency and reliability.",
    },
  ],
};
