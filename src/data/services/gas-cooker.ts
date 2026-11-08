import type { Service } from "../types";
import { GAS_NOTE } from "./compliance";

export const gasCooker: Service = {
  slug: "gas-cooker-repair",
  name: "Gas Cooker",
  title: "Gas Cooker Repair",
  category: "domestic",
  legacyPath: "/gas-cooker/",
  complianceNote: GAS_NOTE,
  shortDescription:
    "Gas cooker and oven repairs — ignition faults, burners not staying lit, ovens not heating, thermocouple and flame-failure problems.",
  intro: [
    "A gas cooker that clicks but won't light, or a burner that goes out as soon as you let go of the knob, is usually being protected by its own safety systems. Modern gas cookers have flame-failure devices on the burners and the oven. They cut off the gas if the flame isn't detected, so a fault often looks dramatic but has a specific, fixable cause such as a worn thermocouple or a weak ignition spark.",
    "Gas appliance work has to be done safely and legally. We diagnose and repair freestanding gas cookers and gas ovens for homes across Feltham and West London, explaining what's wrong and what's involved before starting work.",
  ],
  faults: [
    {
      name: "Burners not igniting",
      detail:
        "No spark, a weak spark or constant clicking can come from a wet or dirty igniter, a misaligned burner cap, a cracked electrode or a failed spark generator.",
    },
    {
      name: "Flame goes out when you let go",
      detail:
        "The thermocouple (flame-failure device) for that burner isn't keeping the gas valve open. It may be worn, dirty or positioned out of the flame.",
    },
    {
      name: "Oven not heating properly",
      detail:
        "A gas oven that won't light, keeps going out or never reaches temperature may have a thermocouple, thermostat, ignition or oven burner fault.",
    },
    {
      name: "Yellow or uneven flames",
      detail:
        "A healthy gas flame is mostly blue. Persistent yellow, floppy or sooty flames suggest poor combustion and should be checked before you use the cooker again.",
    },
    {
      name: "Grill not lighting",
      detail:
        "Eye-level and under-oven grills have their own burner and flame-failure device, which can fail independently of the hob and oven.",
    },
    {
      name: "Oven door not sealing",
      detail:
        "Worn seals or damaged hinges let heat escape, so cooking is uneven and the front of the cooker gets hotter than it should.",
    },
  ],
  sections: [
    {
      heading: "Gas safety first",
      paragraphs: [
        "If you smell gas, don't turn any electrical switches on or off and don't use a naked flame. Turn off the supply at the meter if it's safe to do so, open the windows and call the National Gas Emergency Service on 0800 111 999 straight away.",
        "Warning signs of a cooker that isn't burning safely include yellow or orange flames, soot or staining around the appliance, and condensation building up in the room. Every home with gas appliances should have a working carbon monoxide alarm.",
      ],
    },
    {
      heading: "What a gas cooker repair involves",
      paragraphs: [
        "Most gas cooker repairs involve the ignition system (igniters, spark generator and switches), the flame-failure devices, the oven thermostat, or cleaning and re-seating burners so they burn correctly. Any work on the gas side is followed by checks that the appliance is gas-tight and burning correctly before it's handed back to you.",
      ],
    },
    {
      heading: "Dual-fuel cookers",
      paragraphs: [
        "Many cookers combine a gas hob with an electric oven. The hob is covered here, and the oven side is an electrical repair — see our electric cooker repair page for the common oven faults.",
      ],
    },
  ],
  faqs: [
    {
      question: "What should I do if I smell gas?",
      answer:
        "Don't use any switches or naked flames. Turn off the gas at the meter if it's safe, open the windows and call the National Gas Emergency Service on 0800 111 999 immediately.",
    },
    {
      question: "Why does my gas burner go out when I let go of the knob?",
      answer:
        "This is usually a thermocouple or flame-failure device fault — a safety part that needs testing and replacing correctly.",
    },
    {
      question: "Why does my gas oven take ages to heat up?",
      answer:
        "Possible causes include a partially blocked burner, a weak flame from a faulty valve or thermostat, or heat escaping through a worn door seal.",
    },
    {
      question: "Are your engineers Gas Safe registered?",
      answer: "[CONFIRM BEFORE LAUNCH: add the Gas Safe registration number, or remove gas services.]",
    },
  ],
};
