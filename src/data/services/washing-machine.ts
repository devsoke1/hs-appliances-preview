import type { Service } from "../types";

export const washingMachine: Service = {
  slug: "washing-machine-repair",
  name: "Washing Machine",
  title: "Washing Machine Repair",
  category: "domestic",
  legacyPath: "/washing-machine/",
  shortDescription:
    "Washing machine and washer-dryer repair and installation — not draining, not spinning, leaks, noisy spin cycles, door faults and error codes.",
  intro: [
    "A washing machine is one of the hardest-working appliances in the house, and when it stops mid-cycle, refuses to drain or leaves a puddle on the kitchen floor, everything else gets put on hold. Most faults come down to a handful of parts — the drain pump, door interlock, drive belt or motor brushes, heating element, inlet valves, drum bearings or the main control board. The key to a good repair is finding out which one has actually failed, rather than replacing parts on guesswork.",
    "We repair freestanding and integrated washing machines and washer-dryers in homes across Feltham and West London. We also install new machines: connecting the cold supply and the waste, removing the transit bolts, levelling the machine and running a test cycle so you know it works before we leave.",
  ],
  faults: [
    {
      name: "Not draining",
      detail:
        "Water left in the drum at the end of a cycle usually means a blockage in the filter, sump hose or pump, or a drain pump that has failed. Coins, hair grips and bra wires are common culprits.",
    },
    {
      name: "Drum not spinning",
      detail:
        "The machine may be detecting an unbalanced load. Otherwise the cause could be worn motor brushes, a snapped drive belt, a faulty tacho sensor or a motor control fault.",
    },
    {
      name: "Leaking water",
      detail:
        "Leaks can come from a split door seal, a loose or perished hose, a cracked detergent drawer housing, a failing pump seal or a damaged tub. Finding the exact source matters, because each one has a very different fix.",
    },
    {
      name: "Loud noise on spin",
      detail:
        "Grinding or a roaring noise on spin is often worn drum bearings. Banging can mean a broken damper or suspension spring, or a counterweight that has worked loose.",
    },
    {
      name: "Door won't open or lock",
      detail:
        "Most machines won't start until the door interlock confirms the door is locked. They also won't release it until the drum is empty and the safety delay has passed. A failed interlock or handle mechanism stops either from happening.",
    },
    {
      name: "Not heating",
      detail:
        "Clothes coming out cold or poorly washed can mean a failed heating element, a faulty temperature sensor or a control fault. Limescale on the element is a frequent cause in hard-water areas like West London.",
    },
    {
      name: "Error codes",
      detail:
        "Modern machines store fault codes that point us in the right direction. We use them as a starting point, then test the parts involved to confirm the diagnosis.",
    },
  ],
  sections: [
    {
      heading: "How we diagnose a washing machine fault",
      paragraphs: [
        "We start by asking what the machine was doing when it stopped and checking any error code. Then we run the machine through its test modes, where the manufacturer provides them. Parts are tested with a meter rather than swapped on spec, so you only pay for parts that are actually needed.",
        "If the fault is intermittent — say, a machine that only trips the electrics now and then — we'll explain what we've found and the most likely cause, rather than guessing at an expensive part.",
      ],
    },
    {
      heading: "Repair or replace?",
      paragraphs: [
        "Pumps, door interlocks, belts, brushes, heating elements and hoses are generally worth replacing. Drum bearings are a bigger job. On many machines the tub is sealed, so the whole drum assembly has to be replaced, and that can make the repair poor value on a cheaper or older machine. Control boards sit somewhere in between, depending on the make and the price of the part.",
        "We'll always tell you which side of that line your machine falls on before any work goes ahead.",
      ],
    },
    {
      heading: "Helping your washing machine last longer",
      paragraphs: [
        "Clean the pump filter every few months. Leave the door and drawer open after use so the seal can dry out. Every so often, run an empty hot wash with a machine cleaner or descaler.",
        "Don't overload the drum, and check pockets before washing — small metal objects cause a surprising number of pump and drum repairs.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is it worth repairing my washing machine or should I replace it?",
      answer:
        "It depends on the fault, the age of the machine and the price of the parts. Many common faults — pumps, door locks, belts, heaters — are usually worth fixing. If a repair isn't worth it, we'll tell you honestly.",
    },
    {
      question: "My machine won't drain. Can I get the water out myself?",
      answer:
        "Yes, carefully. Switch the machine off at the wall, put towels down and hold a shallow tray under the pump filter, which is usually behind a small panel at the bottom front. Unscrew the filter slowly, because a lot of water can come out. Never open the door while the drum is full and the machine still has power.",
    },
    {
      question: "Can I keep using my machine if it's leaking?",
      answer:
        "We'd advise against it. Switch the machine off at the wall, close the water valve and don't use it until it's been checked. Leaks can damage flooring and create an electrical risk.",
    },
    {
      question: "Do you repair washer-dryers?",
      answer: "Yes. We repair both the washing and drying functions of washer-dryers, including drying faults such as no heat or poor condensing.",
    },
    {
      question: "Can you install my new washing machine?",
      answer:
        "Yes. We connect the water supply and waste, remove the transit bolts, level the machine and run a test cycle. [CONFIRM: whether you take away old appliances.]",
    },
  ],
};
