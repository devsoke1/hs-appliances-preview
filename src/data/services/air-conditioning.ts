import type { Service } from "../types";
import { FGAS_NOTE } from "./compliance";

export const airConditioning: Service = {
  slug: "air-conditioning-repair",
  name: "Air Conditioning",
  title: "Air Conditioning Repair & Servicing",
  category: "domestic",
  legacyPath: "/air-conditioning/",
  complianceNote: FGAS_NOTE,
  shortDescription:
    "Air conditioning repair and servicing for homes, shops and offices — not cooling, water leaks, noise, smells and error codes.",
  intro: [
    "Air conditioning tends to be forgotten until the first hot week of the year — and that's when faults show up. Weak cooling, water dripping from the indoor unit, strange smells or a system that won't start are often caused by a lack of maintenance: clogged filters, dirty coils or a blocked condensate drain. Others come from failed fan motors, sensors, control boards or a loss of refrigerant.",
    "We repair and service wall-mounted split systems, multi-split systems and portable air conditioners in homes, shops and offices across Feltham and West London. We'll diagnose the fault, explain it clearly and recommend the right fix.",
  ],
  faults: [
    {
      name: "Not cooling or blowing warm air",
      detail:
        "Dirty filters and coils, an outdoor unit that isn't running, a faulty sensor or a low refrigerant charge can all stop a system cooling effectively.",
    },
    {
      name: "Water leaking indoors",
      detail:
        "Most indoor leaks come from a blocked condensate drain or tray. A dirty filter can also make the coil freeze and then drip as it thaws.",
    },
    {
      name: "Noise or vibration",
      detail:
        "Rattling, buzzing or squealing can come from a loose panel, a failing fan motor bearing, debris in the outdoor fan or worn anti-vibration mounts.",
    },
    {
      name: "Bad smells",
      detail:
        "Musty smells usually mean mould or bacteria on the indoor coil, filters or drain tray. It's a sign the system is overdue a clean.",
    },
    {
      name: "Won't turn on or controls not responding",
      detail:
        "Start with the remote batteries and the power supply. After that, it could be a receiver board, main control board or wiring fault between the indoor and outdoor units.",
    },
    {
      name: "Ice on pipework",
      detail:
        "Frost on the pipes or the outdoor unit usually points to restricted airflow or a refrigerant problem. The system shouldn't keep running in that state.",
    },
    {
      name: "Error codes",
      detail:
        "Most systems show fault codes on the indoor unit or remote. They help us find the fault quickly, but we still test to confirm it.",
    },
  ],
  sections: [
    {
      heading: "What an air conditioning service includes",
      paragraphs: [
        "A proper service covers cleaning or replacing filters, cleaning the indoor coil and fan, clearing and testing the condensate drain, cleaning the outdoor unit's coil, checking electrical connections and controls, and checking the system's performance.",
        "Regular servicing keeps the system running efficiently, cuts the risk of breakdowns and helps keep the air that comes out of it clean.",
      ],
    },
    {
      heading: "Refrigerant and the law",
      paragraphs: [
        "Most air conditioning systems use fluorinated refrigerant gases (F-gases). In the UK, anyone who handles them — for example to find leaks, recover or recharge refrigerant — must be properly certified. If a system has lost refrigerant, the leak must be found and repaired, not just topped up.",
      ],
    },
    {
      heading: "For homes and businesses",
      paragraphs: [
        "In a home, air conditioning is usually a matter of comfort. In a shop, salon, office or server cupboard, a failed system can affect staff, customers and equipment.",
        "We work on systems in both domestic and commercial settings. [CONFIRM: types and sizes of commercial systems you service.]",
      ],
    },
  ],
  faqs: [
    {
      question: "How often should air conditioning be serviced?",
      answer:
        "Typically once a year for domestic systems, and more often for commercial units that are in heavy use. Check your manufacturer's recommendations.",
    },
    {
      question: "Why is my air conditioner leaking water?",
      answer:
        "Most often a blocked condensate drain, or a dirty filter causing the coil to freeze and then drip. It's usually quick to resolve.",
    },
    {
      question: "Can you top up the gas in my air conditioning?",
      answer:
        "If a system is low on refrigerant there's a leak somewhere — refrigerant isn't used up. The leak should be found and repaired before recharging, by an F-gas certified engineer.",
    },
    {
      question: "Do you install air conditioning?",
      answer: "[CONFIRM: state whether you install new systems and which types.]",
    },
  ],
};
