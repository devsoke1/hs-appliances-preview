import type { Service, ServiceCategory } from "../types";
import { washingMachine } from "./washing-machine";
import { fridgeFreezer } from "./fridge-freezer";
import { americanFridge } from "./american-fridge";
import { dishwasher } from "./dishwasher";
import { electricCooker } from "./electric-cooker";
import { electricHob } from "./electric-hob";
import { gasCooker } from "./gas-cooker";
import { gasHob } from "./gas-hob";
import { microwave } from "./microwave";
import { airConditioning } from "./air-conditioning";
import { coldRoom } from "./cold-room";
import { dairyCabinet } from "./dairy-cabinet";
import { displayFridge } from "./display-fridge";
import { barCooler } from "./bar-cooler";
import { cellarCooler } from "./cellar-cooler";
import { iceMachine } from "./ice-machine";

/**
 * One file per service — edit copy there.
 * Copy rules: no invented stats, guarantees, prices or accreditations.
 * Anything the business must confirm is marked [CONFIRM …].
 */
export const services: Service[] = [
  washingMachine,
  fridgeFreezer,
  americanFridge,
  dishwasher,
  electricCooker,
  electricHob,
  gasCooker,
  gasHob,
  microwave,
  airConditioning,
  coldRoom,
  dairyCabinet,
  displayFridge,
  barCooler,
  cellarCooler,
  iceMachine,
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const servicesByCategory = (category: ServiceCategory) => services.filter((s) => s.category === category);
export const domesticServices = servicesByCategory("domestic");
export const commercialServices = servicesByCategory("commercial");
export const serviceHref = (slug: string) => `/services/${slug}/`;
