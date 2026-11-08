import type { Service, ServiceCategory } from "./types";

/**
 * Copy rules: no invented stats, guarantees, response times, prices or accreditations.
 * Anything the business must confirm is marked [CONFIRM …] and should be resolved before launch.
 */

const GAS_NOTE =
  "[CONFIRM BEFORE LAUNCH] Work on gas appliances must, by law, be carried out by a Gas Safe registered engineer. Add the engineer's Gas Safe registration number here, or remove gas services from the site.";
const FGAS_NOTE =
  "[CONFIRM BEFORE LAUNCH] Handling refrigerant in air conditioning and commercial refrigeration requires F-Gas certification. Add the certificate/company F-Gas number here.";

export const services: Service[] = [
  // ───────────────────────────── DOMESTIC ─────────────────────────────
  {
    slug: "washing-machine-repair",
    name: "Washing Machine",
    title: "Washing Machine Repair",
    category: "domestic",
    legacyPath: "/washing-machine/",
    shortDescription:
      "Repair, installation and servicing for washing machines and washer-dryers — not draining, not spinning, leaks, noise and error codes.",
    longDescription: [
      "A washing machine that stops mid-cycle, won't drain or starts leaking is one of the most disruptive faults in any home. We diagnose the cause on site — whether it's a blocked pump, worn drum bearings, a failed door lock or a control board fault — explain what's wrong in plain terms, and give you a price before any work starts.",
      "We work on freestanding and integrated washing machines and washer-dryers from most major manufacturers, and we also handle installation of new machines, including connecting water, waste and checking the machine is level.",
    ],
    commonFaults: [
      "Not draining or water left in the drum",
      "Drum not spinning or not turning",
      "Leaking from the door seal, hoses or underneath",
      "Loud banging, grinding or vibration on spin",
      "Door won't open or won't lock",
      "Error codes or flashing lights",
      "Not filling with water or not heating",
    ],
    faqs: [
      {
        question: "Is it worth repairing my washing machine or should I replace it?",
        answer:
          "It depends on the fault, the age of the machine and the cost of parts. Many common faults — pumps, door locks, belts, heaters — are usually economical to fix. If a repair isn't worth it, we'll tell you honestly.",
      },
      {
        question: "Can I keep using my machine if it's leaking?",
        answer:
          "We'd advise against it. Turn the machine off at the wall, close the water supply valve and avoid using it until it's been checked, as leaks can damage flooring and create an electrical risk.",
      },
      {
        question: "Do you repair washer-dryers too?",
        answer: "Yes — we repair both the washing and drying functions of combined washer-dryers.",
      },
    ],
  },
  {
    slug: "fridge-freezer-repair",
    name: "Fridge Freezer",
    title: "Fridge Freezer Repair",
    category: "domestic",
    legacyPath: "/fridge-freezer/",
    shortDescription:
      "Fridge freezer repairs for units that aren't cooling, are icing up, leaking water or making unusual noises.",
    longDescription: [
      "When a fridge freezer stops cooling properly, food safety becomes the priority. We trace the fault — from thermostats, fans and defrost systems to door seals and electrical components — and explain your options clearly before carrying out any repair.",
      "We repair freestanding and integrated fridges, freezers and fridge freezers, including frost-free models.",
    ],
    commonFaults: [
      "Fridge or freezer not cooling / too warm",
      "Freezer icing up or frost build-up",
      "Water pooling inside or under the fridge",
      "Constantly running or clicking on and off",
      "Unusual buzzing, humming or rattling",
      "Door seal not closing properly",
      "Interior light or display not working",
    ],
    faqs: [
      {
        question: "My fridge has stopped cooling — what should I do first?",
        answer:
          "Check it's switched on, the temperature setting hasn't been changed and the vents inside aren't blocked by food. Keep the doors closed as much as possible to preserve the cold, then call us to arrange a diagnosis.",
      },
      {
        question: "Why is there water at the bottom of my fridge?",
        answer:
          "Often it's a blocked defrost drain, but it can also be a failing door seal or a defrost system fault. It's usually straightforward to diagnose on site.",
      },
      {
        question: "Do you repair integrated (built-in) fridge freezers?",
        answer: "Yes, we work on both freestanding and integrated models.",
      },
    ],
  },
  {
    slug: "american-fridge-repair",
    name: "American Fridge",
    title: "American Fridge Freezer Repair",
    category: "domestic",
    legacyPath: "/american-fridge/",
    shortDescription:
      "Repairs for American-style side-by-side fridge freezers — cooling faults, ice makers, water dispensers and leaks.",
    longDescription: [
      "American-style fridge freezers have more to go wrong than a standard unit — ice makers, water dispensers, inlet valves, multiple fans and electronic controls. We diagnose the specific fault and explain whether it's the cooling system, the water system or the electronics before recommending a repair.",
      "We work on side-by-side and multi-door models, including plumbed-in units with water filters and ice dispensers.",
    ],
    commonFaults: [
      "Not cooling or one side warmer than the other",
      "Ice maker not producing ice",
      "Water dispenser not working or dripping",
      "Leaking water onto the floor",
      "Excessive frost in the freezer section",
      "Loud fan or compressor noise",
      "Error codes on the display panel",
    ],
    faqs: [
      {
        question: "Why has my ice maker stopped working?",
        answer:
          "Common causes include a frozen water line, a blocked filter, a faulty inlet valve or a failed ice maker module. We'll identify which before replacing anything.",
      },
      {
        question: "How often should the water filter be changed?",
        answer:
          "Most manufacturers recommend every six months, but check your model's manual. An overdue filter can reduce water flow and affect ice production.",
      },
      {
        question: "Can you install a plumbed American fridge freezer?",
        answer:
          "Yes — we can install and connect the water supply for plumbed-in models. [CONFIRM: remove if you don't offer plumbing connection.]",
      },
    ],
  },
  {
    slug: "dishwasher-repair",
    name: "Dishwasher",
    title: "Dishwasher Repair",
    category: "domestic",
    legacyPath: "/dishwasher/",
    shortDescription:
      "Dishwasher repairs for machines that won't drain, aren't cleaning, leak or show error codes — freestanding and integrated.",
    longDescription: [
      "From dishes coming out dirty to water left sitting in the bottom, dishwasher faults usually come down to pumps, filters, spray arms, heating elements or control electronics. We find the cause and give you a clear quote before carrying out the repair.",
      "We repair freestanding, integrated and slimline dishwashers, and can install new dishwashers including water and waste connections.",
    ],
    commonFaults: [
      "Not draining / standing water in the base",
      "Dishes not coming out clean",
      "Leaking from the door or underneath",
      "Not heating or not drying",
      "Won't start or stops mid-cycle",
      "Detergent not dispensing",
      "Error codes or flashing lights",
    ],
    faqs: [
      {
        question: "Why won't my dishwasher drain?",
        answer:
          "Usually a blocked filter, a blocked waste hose or sink connection, or a faulty drain pump. Cleaning the filter is a good first check; if that doesn't help, we can diagnose it.",
      },
      {
        question: "Why are my dishes still dirty after a cycle?",
        answer:
          "Blocked spray arms, a clogged filter, a weak circulation pump or a heating fault are the usual culprits. Hard water and the wrong detergent can contribute too.",
      },
      {
        question: "Do you repair integrated dishwashers?",
        answer: "Yes — integrated, freestanding and slimline models.",
      },
    ],
  },
  {
    slug: "electric-cooker-repair",
    name: "Electric Cooker",
    title: "Electric Cooker & Oven Repair",
    category: "domestic",
    legacyPath: "/electric-cooker/",
    shortDescription:
      "Electric cooker and oven repairs — not heating, uneven cooking, fan faults, tripping electrics and broken controls.",
    longDescription: [
      "An oven that won't heat or heats unevenly is usually down to an element, thermostat, fan motor, selector switch or timer fault. We test the components safely, explain what's failed and quote before replacing anything.",
      "We repair freestanding electric cookers, built-in single and double ovens, and range-style cookers.",
    ],
    commonFaults: [
      "Oven not heating up or heating slowly",
      "Uneven cooking or burning",
      "Fan not working or noisy",
      "Cooker tripping the electrics",
      "Timer, clock or controls not responding",
      "Grill not working",
      "Door seal or hinge damaged",
    ],
    faqs: [
      {
        question: "My oven trips the electrics — is it safe to use?",
        answer:
          "No. Switch it off at the isolator and don't use it until it's been checked. Tripping usually points to a failed element or wiring fault.",
      },
      {
        question: "Do you repair built-in ovens?",
        answer: "Yes — built-in single and double ovens as well as freestanding cookers.",
      },
      {
        question: "Can you install a new electric cooker?",
        answer:
          "Yes. [CONFIRM: state whether you connect hard-wired cookers to an existing cooker point, and any electrical certification you hold.]",
      },
    ],
  },
  {
    slug: "electric-hob-repair",
    name: "Electric Hob",
    title: "Electric & Induction Hob Repair",
    category: "domestic",
    legacyPath: "/electric-hob/",
    shortDescription:
      "Repairs for ceramic, induction and solid-plate electric hobs — zones not heating, touch controls and error codes.",
    longDescription: [
      "Electric hob faults range from a single zone not heating to touch controls becoming unresponsive. We diagnose ceramic, induction and solid-plate hobs, identify whether the fault is with an element, a control board or the power supply, and explain your options.",
      "If the glass top is cracked, we'll advise whether a replacement panel is available and economical for your model.",
    ],
    commonFaults: [
      "One or more zones not heating",
      "Touch controls not responding",
      "Induction hob not detecting pans",
      "Error codes or flashing display",
      "Hob tripping the electrics",
      "Cracked or chipped glass top",
    ],
    faqs: [
      {
        question: "Can I use my hob if the glass is cracked?",
        answer:
          "No — switch it off at the isolator. A cracked glass top can expose live parts and should be replaced before further use.",
      },
      {
        question: "Why won't my induction hob recognise my pan?",
        answer:
          "Induction needs magnetic cookware with a flat base. If suitable pans aren't detected, the fault may be a sensor, coil or control board.",
      },
      {
        question: "Do you repair induction hobs?",
        answer: "Yes — induction, ceramic and solid-plate electric hobs.",
      },
    ],
  },
  {
    slug: "gas-cooker-repair",
    name: "Gas Cooker",
    title: "Gas Cooker Repair",
    category: "domestic",
    legacyPath: "/gas-cooker/",
    complianceNote: GAS_NOTE,
    shortDescription:
      "Gas cooker and oven repairs — ignition faults, burners not lighting, oven not heating and thermocouple problems.",
    longDescription: [
      "Gas cooker faults need to be handled carefully and legally. Common problems include ignition failure, burners that won't stay lit, thermocouple faults and ovens not reaching temperature. We diagnose the issue, explain it clearly and carry out the repair safely.",
      "If you can smell gas, don't use the appliance — turn off the supply if it's safe to do so and call the National Gas Emergency Service on 0800 111 999.",
    ],
    commonFaults: [
      "Burners not igniting / constant clicking",
      "Burner flame goes out when knob is released",
      "Oven not heating or not reaching temperature",
      "Uneven or yellow flames",
      "Ignition spark not working",
      "Oven door not sealing",
    ],
    faqs: [
      {
        question: "What should I do if I smell gas?",
        answer:
          "Don't use any switches or naked flames. Turn off the gas at the meter if it's safe, open windows and call the National Gas Emergency Service on 0800 111 999 immediately.",
      },
      {
        question: "Why does my gas burner go out when I let go of the knob?",
        answer:
          "This is usually a thermocouple or flame-failure device fault — a safety component that needs to be tested and replaced correctly.",
      },
      {
        question: "Are your engineers Gas Safe registered?",
        answer: "[CONFIRM BEFORE LAUNCH: add Gas Safe registration number, or remove gas services.]",
      },
    ],
  },
  {
    slug: "gas-hob-repair",
    name: "Gas Hob",
    title: "Gas Hob Repair",
    category: "domestic",
    legacyPath: "/gas-hob/",
    complianceNote: GAS_NOTE,
    shortDescription:
      "Gas hob repairs — burners not lighting, ignition clicking, weak or uneven flames and faulty control knobs.",
    longDescription: [
      "A gas hob that won't light, keeps clicking or produces a weak or uneven flame should be checked properly. We test ignition systems, flame-failure devices, burners and controls, and explain what's needed before any work is carried out.",
      "If you can smell gas, stop using the hob, turn off the supply if it's safe and call the National Gas Emergency Service on 0800 111 999.",
    ],
    commonFaults: [
      "Burner won't light",
      "Ignition keeps clicking after lighting",
      "Flame goes out when knob is released",
      "Weak, uneven or yellow flame",
      "Stiff or broken control knobs",
    ],
    faqs: [
      {
        question: "Why does my gas hob keep clicking?",
        answer:
          "Moisture or food debris around the igniter, a misaligned burner cap or a faulty ignition switch are common causes. If cleaning and drying doesn't help, it needs checking.",
      },
      {
        question: "Is a yellow flame dangerous?",
        answer:
          "A healthy gas flame is mostly blue. A persistent yellow or orange flame can indicate incomplete combustion — stop using the hob and have it checked.",
      },
      {
        question: "Are your engineers Gas Safe registered?",
        answer: "[CONFIRM BEFORE LAUNCH: add Gas Safe registration number, or remove gas services.]",
      },
    ],
  },
  {
    slug: "microwave-repair",
    name: "Microwave",
    title: "Microwave Repair",
    category: "domestic",
    legacyPath: "/microwave/",
    shortDescription:
      "Microwave and combination oven repairs — not heating, turntable not turning, sparking, and door or control faults.",
    longDescription: [
      "Microwaves contain high-voltage components that retain a dangerous charge even when unplugged, so repairs should only be done by someone trained to work on them. We diagnose heating faults, door switch problems, turntable and control issues on freestanding and built-in models.",
      "For lower-cost freestanding microwaves, we'll be upfront if replacement makes more sense than repair.",
    ],
    commonFaults: [
      "Runs but doesn't heat food",
      "Turntable not turning",
      "Sparking or arcing inside",
      "Door not closing or not starting",
      "Buttons or touch panel unresponsive",
      "Blowing fuses or tripping electrics",
    ],
    faqs: [
      {
        question: "Is it worth repairing a microwave?",
        answer:
          "Built-in and combination microwaves are often worth repairing. For basic freestanding models, replacement may be more economical — we'll tell you honestly.",
      },
      {
        question: "Why is my microwave sparking?",
        answer:
          "Often metal in the cavity, a damaged waveguide cover or a build-up of food residue. Stop using it until it's been checked.",
      },
      {
        question: "Do you repair built-in microwaves?",
        answer: "Yes, including built-in combination microwave ovens.",
      },
    ],
  },
  {
    slug: "air-conditioning-repair",
    name: "Air Conditioning",
    title: "Air Conditioning Repair & Servicing",
    category: "domestic",
    legacyPath: "/air-conditioning/",
    complianceNote: FGAS_NOTE,
    shortDescription:
      "Air conditioning repair, servicing and installation for homes, shops and offices — not cooling, leaks, noise and error codes.",
    longDescription: [
      "Air conditioning units lose efficiency without regular maintenance, and faults often show up first as weak cooling, water leaks or unusual noise. We diagnose split and portable systems, clean and service units, and carry out repairs to fans, sensors, controls and refrigerant circuits.",
      "Regular servicing helps keep systems running efficiently and can catch problems before they become breakdowns.",
    ],
    commonFaults: [
      "Not cooling or blowing warm air",
      "Water leaking from the indoor unit",
      "Unusual noises or vibration",
      "Bad smells when running",
      "Remote or controls not responding",
      "Error codes on the unit",
      "Ice forming on pipework",
    ],
    faqs: [
      {
        question: "How often should air conditioning be serviced?",
        answer:
          "Typically once a year for domestic systems, and more often for commercial units in heavy use. Check your manufacturer's recommendations.",
      },
      {
        question: "Why is my air conditioner leaking water?",
        answer:
          "Most often a blocked condensate drain or a dirty filter causing the coil to freeze and then drip. It's usually straightforward to resolve.",
      },
      {
        question: "Do you install air conditioning?",
        answer: "[CONFIRM: state whether you install new systems and which types.]",
      },
    ],
  },

  // ──────────────────────────── COMMERCIAL ────────────────────────────
  {
    slug: "cold-room-repair",
    name: "Cold Room",
    title: "Cold Room Repair & Maintenance",
    category: "commercial",
    legacyPath: "/refrigeration-cold-room/",
    complianceNote: FGAS_NOTE,
    shortDescription:
      "Commercial cold room and walk-in freezer repairs and maintenance for restaurants, shops and food businesses.",
    longDescription: [
      "A failing cold room puts stock and food-safety compliance at risk. We diagnose walk-in chillers and freezers — compressors, condensers, evaporator fans, controllers, door seals and defrost systems — and explain the fault and the fix clearly.",
      "Planned maintenance helps reduce the risk of unexpected breakdowns. [CONFIRM: describe any maintenance contracts you offer.]",
    ],
    commonFaults: [
      "Not holding temperature",
      "Ice build-up on the evaporator",
      "Compressor short-cycling or not starting",
      "Door seals or heaters failing",
      "Alarm or controller faults",
      "Water leaking inside the room",
    ],
    faqs: [
      {
        question: "What should I do if my cold room stops cooling?",
        answer:
          "Keep the door closed, record the temperature, move high-risk stock to alternative refrigeration if possible and call us straight away.",
      },
      {
        question: "Do you offer planned maintenance for cold rooms?",
        answer: "[CONFIRM: describe your maintenance offering.]",
      },
      {
        question: "Do you work on walk-in freezers as well as chillers?",
        answer: "Yes — both walk-in chillers and freezer rooms.",
      },
    ],
  },
  {
    slug: "dairy-cabinet-repair",
    name: "Dairy Cabinet",
    title: "Dairy Cabinet Repair",
    category: "commercial",
    legacyPath: "/dairy-cabinet/",
    complianceNote: FGAS_NOTE,
    shortDescription:
      "Multideck dairy cabinet repairs for convenience stores and supermarkets — temperature faults, fans, lighting and night blinds.",
    longDescription: [
      "Open-front multideck dairy cabinets work hard in a busy shop. When temperatures rise, it's usually down to airflow, fans, evaporator icing, condenser problems or controller faults. We diagnose the cause and get chilled displays back to safe temperatures.",
      "We work on both integral (plug-in) and remote cabinets.",
    ],
    commonFaults: [
      "Cabinet running warm",
      "Evaporator icing up",
      "Fans not running",
      "Lighting or night blind faults",
      "Water leaking onto the shop floor",
      "Noisy compressor or condenser",
    ],
    faqs: [
      {
        question: "Why is my dairy cabinet running warm?",
        answer:
          "Blocked air curtains from overfilled shelves, iced evaporators, failed fans or dirty condensers are common causes. We'll check each systematically.",
      },
      {
        question: "Do you repair remote and integral cabinets?",
        answer: "Yes, both types.",
      },
      {
        question: "Can you help keep cabinets running efficiently?",
        answer:
          "Regular condenser cleaning and checks on seals, fans and controllers help efficiency and reliability.",
      },
    ],
  },
  {
    slug: "display-fridge-repair",
    name: "Display Fridge",
    title: "Display Fridge Repair",
    category: "commercial",
    legacyPath: "/display-fridge/",
    complianceNote: FGAS_NOTE,
    shortDescription:
      "Commercial display fridge repairs — glass-door merchandisers, serve-over counters and chilled displays.",
    longDescription: [
      "Display fridges keep stock visible and at a safe temperature. When they misbehave — running warm, misting up, icing or making noise — it affects both sales and compliance. We diagnose glass-door merchandisers, serve-over counters and other chilled displays.",
      "We'll explain the fault, the repair and the cost before starting work.",
    ],
    commonFaults: [
      "Not cooling to temperature",
      "Condensation on glass doors",
      "Ice forming on the back wall",
      "Fan or lighting failure",
      "Door seals worn or not closing",
      "Thermostat or controller faults",
    ],
    faqs: [
      {
        question: "Why is my display fridge door misting up?",
        answer:
          "Usually high humidity, a failing door seal or a faulty door heater. Persistent misting should be checked.",
      },
      {
        question: "Do you repair serve-over counters?",
        answer: "Yes, as well as upright glass-door merchandisers.",
      },
      {
        question: "Can you supply replacement parts for older models?",
        answer:
          "We'll source parts where they're available, and advise honestly if a unit is no longer economical to repair.",
      },
    ],
  },
  {
    slug: "bar-cooler-repair",
    name: "Bar Cooler",
    title: "Bar Cooler Repair",
    category: "commercial",
    legacyPath: "/bar-cooler/",
    complianceNote: FGAS_NOTE,
    shortDescription:
      "Back-bar bottle cooler repairs for pubs, bars and restaurants — not cooling, noisy fans, door and lighting faults.",
    longDescription: [
      "Back-bar bottle coolers often run in warm, cramped spaces with limited ventilation, which puts strain on condensers and fans. We diagnose cooling, fan, thermostat and door faults on single, double and triple-door units.",
    ],
    commonFaults: [
      "Drinks not cold enough",
      "Running constantly",
      "Noisy fan or compressor",
      "Doors not closing or seals worn",
      "Lighting not working",
    ],
    faqs: [
      {
        question: "Why is my bar cooler not getting cold?",
        answer:
          "A dirty condenser, poor ventilation behind the bar, a failed fan or a thermostat fault are the most common causes.",
      },
      {
        question: "Do you repair glass-door and solid-door bar coolers?",
        answer: "Yes, both.",
      },
      {
        question: "How can I help my bar cooler last longer?",
        answer:
          "Keep ventilation clear, avoid overloading, and have the condenser cleaned regularly.",
      },
    ],
  },
  {
    slug: "cellar-cooler-repair",
    name: "Cellar Cooler",
    title: "Cellar Cooler Repair",
    category: "commercial",
    legacyPath: "/celler-cooler/",
    complianceNote: FGAS_NOTE,
    shortDescription:
      "Beer cellar cooling repairs for pubs and bars — cellar running warm, iced evaporators, fan and controller faults.",
    longDescription: [
      "A warm beer cellar affects product quality straight away. We diagnose cellar cooling systems including evaporators, condensing units, fans and controllers, and explain the fault and fix before work begins.",
    ],
    commonFaults: [
      "Cellar running warm",
      "Evaporator icing up",
      "Condensing unit not starting",
      "Fan not running",
      "Water leaking from the evaporator",
    ],
    faqs: [
      {
        question: "What temperature should a beer cellar be?",
        answer:
          "Cask ale cellars are commonly kept around 11–13°C — check your brewer's guidance for your products.",
      },
      {
        question: "Why is my cellar cooler icing up?",
        answer:
          "Low airflow, a defrost problem, a dirty coil or a refrigerant issue are typical causes.",
      },
      {
        question: "Do you service cellar cooling systems?",
        answer: "Yes — servicing helps catch problems early. [CONFIRM: maintenance offering.]",
      },
    ],
  },
  {
    slug: "ice-machine-repair",
    name: "Ice Machine",
    title: "Ice Machine Repair",
    category: "commercial",
    legacyPath: "/ice-machine/",
    shortDescription:
      "Commercial ice machine repairs and cleaning — not making ice, small or cloudy cubes, leaks and scale build-up.",
    longDescription: [
      "Ice machines need regular cleaning and descaling to stay hygienic and productive, especially in hard-water areas. We diagnose production faults, water supply problems, pumps, sensors and refrigeration issues, and can clean and sanitise machines.",
    ],
    commonFaults: [
      "Not making ice",
      "Small, thin or cloudy cubes",
      "Slow ice production",
      "Leaking water",
      "Scale build-up",
      "Ice tasting or smelling bad",
    ],
    faqs: [
      {
        question: "How often should an ice machine be cleaned?",
        answer:
          "Follow the manufacturer's schedule — commonly every few months, more often in hard-water areas or busy sites.",
      },
      {
        question: "Why is my ice machine making small cubes?",
        answer:
          "Low water pressure, a blocked filter, scale build-up or a sensor issue are common causes.",
      },
      {
        question: "Do you repair under-counter and modular ice machines?",
        answer: "[CONFIRM: types of ice machine you work on.]",
      },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const servicesByCategory = (category: ServiceCategory) =>
  services.filter((s) => s.category === category);
export const domesticServices = servicesByCategory("domestic");
export const commercialServices = servicesByCategory("commercial");
export const serviceHref = (slug: string) => `/services/${slug}/`;
