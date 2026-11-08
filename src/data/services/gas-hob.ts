import type { Service } from "../types";
import { GAS_NOTE } from "./compliance";

export const gasHob: Service = {
  slug: "gas-hob-repair",
  name: "Gas Hob",
  title: "Gas Hob Repair",
  category: "domestic",
  legacyPath: "/gas-hob/",
  complianceNote: GAS_NOTE,
  shortDescription:
    "Gas hob repairs — burners not lighting, constant clicking, flames going out, weak or yellow flames and stiff or broken control knobs.",
  intro: [
    "Gas hobs are simple and reliable, but the parts that light and protect each burner take a battering from heat, spills and cleaning. The result is the familiar set of faults: a burner that won't light, ignition that keeps clicking long after the flame has caught, or a flame that dies when you release the knob.",
    "We repair built-in gas hobs and the hob section of freestanding gas and dual-fuel cookers for homes across Feltham and West London. We'll find out why a burner is misbehaving and explain the fix before carrying out any work.",
  ],
  faults: [
    {
      name: "Burner won't light",
      detail:
        "The igniter may be wet, dirty or cracked, the burner cap may be sitting slightly off, or the burner ports may be blocked with food debris.",
    },
    {
      name: "Constant clicking",
      detail:
        "Ignition that keeps sparking after the burner has lit — or with all knobs off — is often caused by moisture in a switch or a failing ignition switch or generator.",
    },
    {
      name: "Flame goes out on release",
      detail:
        "Each burner's thermocouple must heat up and hold the gas valve open. A worn or misaligned thermocouple lets the flame die as soon as you let go.",
    },
    {
      name: "Weak, uneven or yellow flame",
      detail:
        "Blocked burner ports, an incorrectly seated cap or a supply problem can produce a poor flame. A yellow flame suggests incomplete combustion and needs checking.",
    },
    {
      name: "Stiff or broken knobs",
      detail:
        "Spills can gum up the gas taps, and knobs can crack or wear. Stiff taps should be serviced or replaced rather than forced.",
    },
  ],
  sections: [
    {
      heading: "Why burners won't light or stay lit",
      paragraphs: [
        "Lighting a burner takes a chain of parts working together. The ignition switch on the gas tap triggers a spark generator, which sends a high-voltage pulse to the electrode beside the burner. Then the thermocouple has to heat up enough to hold the gas valve open. A problem anywhere along that chain shows up as a burner that won't light or won't stay lit.",
        "Testing each part in turn tells us whether it's a simple clean-and-realign or a part that needs replacing.",
      ],
    },
    {
      heading: "Cleaning without causing faults",
      paragraphs: [
        "Many ignition faults start after cleaning. Avoid flooding the burners with water, make sure the caps and crowns are fully dry before refitting, and check they sit flat and in the correct position.",
        "If the ignition keeps clicking after cleaning, leave the hob to dry out for a few hours before assuming a part has failed.",
      ],
    },
    {
      heading: "Gas safety",
      paragraphs: [
        "If you smell gas, turn off the supply at the meter if it's safe, open the windows, avoid switches and naked flames, and call the National Gas Emergency Service on 0800 111 999. A carbon monoxide alarm in any room with a gas appliance is strongly recommended.",
      ],
    },
    {
      heading: "Built-in hobs and cooker hobs",
      paragraphs: [
        "Built-in gas hobs sit in the worktop, with the gas taps, ignition generator and pipework underneath. Some repairs mean lifting the hob or getting into the cupboard below, so clearing that space before the visit helps.",
        "On freestanding gas and dual-fuel cookers, the same parts are behind the control panel. The faults are the same, but the way in is different.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why does my gas hob keep clicking?",
      answer:
        "Moisture or food debris around the igniter, a misaligned burner cap or a faulty ignition switch are common causes. If drying and cleaning doesn't help, it needs checking.",
    },
    {
      question: "Is a yellow flame dangerous?",
      answer:
        "A healthy gas flame is mostly blue. A persistent yellow or orange flame can indicate incomplete combustion — stop using the hob and have it checked.",
    },
    {
      question: "Can you install or disconnect a gas hob?",
      answer: "[CONFIRM: state whether you install, connect or disconnect gas hobs, subject to Gas Safe registration.]",
    },
    {
      question: "Are your engineers Gas Safe registered?",
      answer: "[CONFIRM BEFORE LAUNCH: add the Gas Safe registration number, or remove gas services.]",
    },
  ],
};
