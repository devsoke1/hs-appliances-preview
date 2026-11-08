import type { Service } from "../types";

export const iceMachine: Service = {
  slug: "ice-machine-repair",
  name: "Ice Machine",
  title: "Ice Machine Repair",
  category: "commercial",
  legacyPath: "/ice-machine/",
  shortDescription:
    "Commercial ice machine repairs and cleaning — not making ice, small or cloudy cubes, slow production, leaks and scale build-up.",
  intro: [
    "A bar, restaurant or hotel that runs out of ice notices straight away. Ice machines combine refrigeration, water supply, pumps, sensors and timing controls, and they're unforgiving of hard water and poor hygiene. Many \"breakdowns\" turn out to be scale build-up, a blocked filter or a sensor that can't detect ice properly, while others are refrigeration or electrical faults.",
    "We repair, clean and descale commercial ice machines for businesses across Feltham and West London. We'll find out why production has dropped or stopped and explain what's needed to get it going again.",
  ],
  faults: [
    {
      name: "Not making ice",
      detail:
        "The water supply may be off or restricted, the inlet valve may have failed, the water pump may not be running, or there may be a refrigeration or control fault.",
    },
    {
      name: "Small, thin or cloudy cubes",
      detail:
        "Low water pressure, a blocked filter, scale on the evaporator or water distribution system, or a faulty sensor can all affect the size and clarity of the ice.",
    },
    {
      name: "Slow production",
      detail:
        "A dirty air-cooled condenser, a hot room, scale build-up or a refrigeration problem can make the machine produce far less ice than it's rated for.",
    },
    {
      name: "Leaking water",
      detail:
        "A blocked drain, a split hose, a stuck inlet valve or a cracked water trough can cause leaks around or under the machine.",
    },
    {
      name: "Scale build-up",
      detail:
        "In hard-water areas like West London, limescale coats the evaporator plate, water pump and distribution tubes, reducing output and eventually stopping production.",
    },
    {
      name: "Ice tastes or smells bad",
      detail:
        "This usually means the machine needs cleaning and sanitising, the water filter needs changing, or slime or mould has built up in the water system.",
    },
  ],
  sections: [
    {
      heading: "Ice is food — hygiene matters",
      paragraphs: [
        "Ice that goes into drinks is treated as food, so the machine that makes it needs cleaning and sanitising regularly. Slime and mould can grow in the water trough, distribution system and storage bin, and it isn't always visible from the front.",
        "Regular professional cleaning, following the manufacturer's schedule, keeps ice safe and the machine working efficiently.",
      ],
    },
    {
      heading: "Hard water and scale",
      paragraphs: [
        "Most of West London has hard water. Scale forms quickly on ice machine parts, and it's one of the main reasons machines lose output or stop altogether.",
        "A suitable water filter or scale-inhibiting cartridge, changed on schedule, greatly reduces how often a machine needs descaling.",
      ],
    },
    {
      heading: "Location and airflow",
      paragraphs: [
        "Most smaller ice machines are air-cooled and need clear space around them to get rid of heat. Under a counter next to a dishwasher, or in a hot kitchen corridor, they work harder and make less ice.",
        "Keeping the condenser clean and the vents clear makes a noticeable difference to output.",
      ],
    },
    {
      heading: "Types of ice machine",
      paragraphs: [
        "Self-contained under-counter machines make and store ice in one cabinet and are common in bars and smaller restaurants. Modular machines sit on top of a separate storage bin and make more ice for hotels and busy venues. Flake and nugget machines produce softer ice for food displays, fish counters and healthcare.",
        "Each type works a little differently, but they share the same basics — water supply, refrigeration, harvest controls and drainage — and the same need for regular cleaning.",
      ],
    },
  ],
  faqs: [
    {
      question: "How often should an ice machine be cleaned?",
      answer:
        "Follow the manufacturer's schedule — commonly every few months, and more often in hard-water areas or busy sites.",
    },
    {
      question: "Why is my ice machine making small cubes?",
      answer: "Low water pressure, a blocked filter, scale build-up or a sensor issue are the common causes.",
    },
    {
      question: "Why does my ice taste strange?",
      answer:
        "Usually the machine is overdue for cleaning and sanitising, or the water filter needs changing. It can also come from food odours in the room getting into the bin.",
    },
    {
      question: "Do you repair under-counter and modular ice machines?",
      answer: "[CONFIRM: the types of ice machine you work on.]",
    },
  ],
};
