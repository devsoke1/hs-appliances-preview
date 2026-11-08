import type { Service } from "../types";

export const americanFridge: Service = {
  slug: "american-fridge-repair",
  name: "American Fridge",
  title: "American Fridge Freezer Repair",
  category: "domestic",
  legacyPath: "/american-fridge/",
  shortDescription:
    "American-style fridge freezer repairs — cooling faults, ice makers, water dispensers, leaks and error codes on side-by-side and multi-door models.",
  intro: [
    "American-style fridge freezers have a lot more going on than a standard fridge. As well as the cooling system, there's usually an ice maker, a chilled water dispenser, a water inlet valve and filter, several fans and an electronic control panel. When something goes wrong, the first job is to work out which of those systems is at fault, because a leak, a warm fridge and an ice maker that's stopped can all have overlapping causes.",
    "We repair side-by-side, French-door and multi-door American fridge freezers, including plumbed-in models with filtered water and ice. Our engineers cover Feltham and the surrounding West London areas, and we'll explain what's wrong and what it will take to fix before starting any repair.",
  ],
  faults: [
    {
      name: "Not cooling, or one side warmer",
      detail:
        "Most American fridges cool both compartments from one evaporator, with fans and dampers moving the air around. A blocked air duct, a failed fan or an iced-up coil can leave one side warm.",
    },
    {
      name: "Ice maker not producing ice",
      detail:
        "Check first that the ice maker is switched on. After that, the usual suspects are a frozen fill tube, a blocked water filter, low water pressure, a faulty inlet valve or a failed ice maker module.",
    },
    {
      name: "Water dispenser not working",
      detail:
        "A frozen water line in the door, an overdue filter, a faulty dispenser switch or an inlet valve fault can all stop the flow. A dripping dispenser often points to a leaking valve.",
    },
    {
      name: "Leaking onto the floor",
      detail:
        "Leaks can come from the water supply connection, a cracked filter housing, a split internal water line or a blocked defrost drain overflowing.",
    },
    {
      name: "Excessive frost",
      detail:
        "Frost building up in the freezer usually means a defrost system fault or a door that isn't sealing — on heavy doors this is sometimes a levelling problem rather than a bad seal.",
    },
    {
      name: "Noisy fans or compressor",
      detail:
        "A grinding or ticking noise is often ice catching a fan blade. Loud humming can come from the compressor or the condenser fan at the back.",
    },
    {
      name: "Display or error codes",
      detail:
        "Many models show diagnostic codes on the control panel. We read them and use the manufacturer's test mode, where it has one, to narrow down the fault.",
    },
  ],
  sections: [
    {
      heading: "Water and ice system faults",
      paragraphs: [
        "Ice and water problems are the most common complaint with American fridges. Inlet valves need a minimum water pressure to open properly, so a weak supply can cause slow ice production or a trickling dispenser. A filter left in too long has the same effect.",
        "In some designs the water line runs through the freezer door, and it can freeze if the door seal or the door heater has a problem. We check the whole route from the supply to the dispenser so the fix lasts.",
      ],
    },
    {
      heading: "Positioning, levelling and installation",
      paragraphs: [
        "American fridge freezers are heavy, and their doors are wide. If the cabinet isn't level, or tilts very slightly forward rather than back, the doors may not close and seal by themselves. That leads to frost, condensation and a compressor that runs all the time.",
        "They also need space around them to get rid of heat. If a unit has been moved or laid on its side, manufacturers generally recommend leaving it upright for a period before switching it on, so check your manual. We can help with installing and connecting the water supply on plumbed models.",
      ],
    },
    {
      heading: "Is it worth repairing?",
      paragraphs: [
        "Because American fridges are relatively expensive to replace, faults with fans, valves, sensors, ice makers and control boards are usually worth fixing. Sealed-system faults such as a refrigerant leak or a failed compressor need a more careful cost comparison. We'll give you the information to make that call.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why has my ice maker stopped working?",
      answer:
        "Common causes include a frozen water line, a blocked filter, a faulty inlet valve or a failed ice maker module. We find out which before replacing anything.",
    },
    {
      question: "How often should the water filter be changed?",
      answer:
        "Most manufacturers recommend about every six months, but check your model's manual. An overdue filter can reduce water flow and affect ice production.",
    },
    {
      question: "Why is my American fridge leaking water?",
      answer:
        "Typical causes are a loose supply connection, a cracked filter housing, a split internal water line or a blocked defrost drain. Turn off the water supply to the fridge if you can, and dry the area to stop floor damage.",
    },
    {
      question: "Will you need to pull the fridge out?",
      answer:
        "Usually, yes — many faults are only reachable from the back. Please clear a little space in front so it can be moved carefully. We take care to protect your flooring.",
    },
    {
      question: "Can you install a plumbed American fridge freezer?",
      answer:
        "Yes, we can install and connect the water supply for plumbed-in models. [CONFIRM: remove if you don't offer the plumbing connection.]",
    },
  ],
};
