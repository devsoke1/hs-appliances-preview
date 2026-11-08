import type { Area } from "./types";

export { coveredPostcodes, outwardCode, checkPostcode } from "./postcodes";
export type { AreaIndexEntry, PostcodeResult } from "./postcodes";
import type { AreaIndexEntry } from "./postcodes";

/* ─────────────────────────────── Area pages ───────────────────────────────
 * Travel times are approximate, from 209 Hounslow Road (TW13 6AD), outside peak traffic.
 * [CONFIRM] keyServices reflect each area's housing/business mix — swap in what your job records show.
 */
export const areas: Area[] = [
  {
    slug: "feltham",
    name: "Feltham",
    borough: "London Borough of Hounslow",
    postcodes: ["TW13", "TW14"],
    travel: { miles: 0, minutes: "5–10" },
    summary: "Our home base on Hounslow Road — Feltham, Hanworth, Bedfont and North Feltham.",
    intro: [
      "Feltham is where we're based. Our workshop is at 209 Hounslow Road, on the Hanworth side of town, so homes and businesses across TW13 and TW14 are on our doorstep. Short travel times make it easier to fit appointments around your day and to come back quickly if a part needs ordering.",
      "We cover the whole of Feltham — from the streets around the High Street and the station, out to Hanworth and Hanworth Park, Lower Feltham, North Feltham and across to Bedfont on the edge of Bedfont Lakes Country Park.",
    ],
    neighbourhoods: ["Feltham town centre", "Hanworth", "Hanworth Park", "Lower Feltham", "North Feltham", "Bedfont", "East Bedfont"],
    local: {
      heading: "Homes and businesses in Feltham",
      paragraphs: [
        "Feltham has a real mix of housing: interwar semis and terraces around Hanworth, post-war estates, and newer flats and townhouses near the station and the High Street redevelopment. Laundry and refrigeration faults are the bread and butter of domestic repairs, and in smaller flat kitchens we often find integrated appliances that need sliding out of their housings.",
        "Commercially, Feltham sits next to Heathrow, with the warehouses and distribution sites around the airport's southern edge, plus the shops, cafés and takeaways along the High Street and Hounslow Road. That's where commercial refrigeration — display fridges, bottle coolers and cold rooms — comes in.",
      ],
    },
    keyServices: [
      { slug: "washing-machine-repair", reason: "The most common household breakdown, and our base is a few minutes away." },
      { slug: "fridge-freezer-repair", reason: "Quick to reach when a fridge stops cooling and food is at risk." },
      { slug: "display-fridge-repair", reason: "For the cafés, convenience stores and takeaways on the High Street and Hounslow Road." },
    ],
    nearby: ["hounslow", "ashford", "heathrow", "twickenham"],
  },
  {
    slug: "hounslow",
    name: "Hounslow",
    borough: "London Borough of Hounslow",
    postcodes: ["TW3", "TW4", "TW5"],
    travel: { miles: 3, minutes: "10–15" },
    summary: "Hounslow town centre, Hounslow West, Heston, Cranford and Lampton.",
    intro: [
      "Hounslow is a short drive up Hounslow Road from our Feltham base, which makes it one of the easiest areas for us to reach. We cover the town centre around the High Street and Bell Corner, the residential streets around Hounslow Heath, and out through Hounslow West, Heston, Cranford and Lampton.",
      "With three Piccadilly line stations and the A4 and A30 running through, Hounslow is busy — and so are its kitchens. Whether it's a family home in TW3 or a restaurant on the High Street, we'll explain what's wrong and quote before any work starts.",
    ],
    neighbourhoods: ["Hounslow town centre", "Hounslow West", "Hounslow Heath", "Heston", "Cranford", "Lampton", "Hounslow East"],
    local: {
      heading: "Homes and businesses in Hounslow",
      paragraphs: [
        "Hounslow's housing is mostly Victorian and Edwardian terraces near the centre, interwar semis towards Heston and Cranford, and an increasing number of flats around the High Street. Many larger households mean washing machines, dishwashers and fridge freezers work hard, and wear-related faults such as drum bearings, pumps and door seals are common.",
        "The High Street and the roads around it are full of restaurants, sweet centres, grocers and takeaways that rely on display fridges, cold rooms and freezers. When those fail, a quick diagnosis matters more than anywhere.",
      ],
    },
    keyServices: [
      { slug: "washing-machine-repair", reason: "Busy family households put washing machines through heavy use." },
      { slug: "american-fridge-repair", reason: "Large American-style fridge freezers are a popular choice in bigger family kitchens." },
      { slug: "cold-room-repair", reason: "For the restaurants, grocers and food businesses in and around the town centre." },
    ],
    nearby: ["feltham", "isleworth", "heathrow", "southall"],
  },
  {
    slug: "twickenham",
    name: "Twickenham",
    borough: "London Borough of Richmond upon Thames",
    postcodes: ["TW1", "TW2"],
    travel: { miles: 4, minutes: "15–20" },
    summary: "Twickenham, Whitton, Strawberry Hill and St Margarets.",
    intro: [
      "Twickenham is about fifteen minutes east of our Feltham base, through Hanworth and Whitton. We cover the whole TW1 and TW2 area, from Whitton and the streets around Twickenham Stadium to the town centre, Church Street, Strawberry Hill and St Margarets.",
      "Twickenham is known for rugby and the riverside, but day to day it's a residential area with a lively high street. We look after both the homes and the pubs, cafés and restaurants that fill up on match days.",
    ],
    neighbourhoods: ["Twickenham town centre", "Whitton", "Strawberry Hill", "St Margarets", "Twickenham riverside", "Heatham"],
    local: {
      heading: "Homes and businesses in Twickenham",
      paragraphs: [
        "Much of Twickenham's housing is Victorian and Edwardian, with plenty of period conversions and family homes in St Margarets and Strawberry Hill. Kitchens here often have built-in ovens, induction hobs and integrated dishwashers, which take a little more care to remove and refit for repair.",
        "On the commercial side, Twickenham's pubs and bars around Church Street, the riverside and the routes to the stadium depend on cellar cooling and bottle coolers — especially on match days and through the summer.",
      ],
    },
    keyServices: [
      { slug: "electric-hob-repair", reason: "Induction and ceramic hobs are common in Twickenham's period-home kitchens." },
      { slug: "dishwasher-repair", reason: "Integrated dishwashers are standard in many fitted kitchens here." },
      { slug: "cellar-cooler-repair", reason: "For pubs that need stable cellar temperatures, especially on match days." },
    ],
    nearby: ["richmond", "isleworth", "feltham", "kingston"],
  },
  {
    slug: "ashford",
    name: "Ashford",
    borough: "Spelthorne Borough Council, Surrey",
    postcodes: ["TW15"],
    travel: { miles: 3, minutes: "10–15" },
    summary: "Ashford town centre, Ashford Common and the TW15 area of Spelthorne.",
    intro: [
      "Ashford sits just across the border in Surrey, a short drive west of Feltham, so TW15 is one of our closest areas. We cover Ashford town centre and the shops on Church Road, the streets around Ashford station, Ashford Common and the residential roads out towards the Queen Mary Reservoir.",
      "Being so close to our base, Ashford is an easy area for us to reach when an appliance breaks down unexpectedly.",
    ],
    neighbourhoods: ["Ashford town centre", "Church Road", "Ashford Common", "Chattern Hill", "Clockhouse Lane area"],
    local: {
      heading: "Homes and businesses in Ashford",
      paragraphs: [
        "Ashford is largely residential — interwar and post-war semi-detached houses, bungalows and newer developments — with a high proportion of family homes. That means plenty of washing machines, tumble dryers, fridge freezers and dishwashers, and cookers that see daily use.",
        "The Church Road shopping area and local parades have convenience stores, cafés and takeaways that rely on display fridges and chilled cabinets.",
      ],
    },
    keyServices: [
      { slug: "washing-machine-repair", reason: "Family homes across TW15 rely on their washing machines daily." },
      { slug: "electric-cooker-repair", reason: "Freestanding and built-in ovens are a regular call-out in family kitchens." },
      { slug: "dairy-cabinet-repair", reason: "For convenience stores on Church Road and local parades." },
    ],
    nearby: ["feltham", "staines", "heathrow"],
  },
  {
    slug: "staines",
    name: "Staines-upon-Thames",
    borough: "Spelthorne Borough Council, Surrey",
    postcodes: ["TW18", "TW19"],
    travel: { miles: 6, minutes: "15–20" },
    summary: "Staines town centre, Stanwell, Laleham and the riverside.",
    intro: [
      "Staines-upon-Thames is around fifteen to twenty minutes west of our Feltham base along the A30. We cover TW18 and TW19, including Staines town centre, the riverside, Laleham, Egham Hythe on the Staines side, and Stanwell and Stanwell Moor towards Heathrow.",
      "Staines combines a busy town centre — the High Street, the Elmsleigh Centre and Two Rivers — with quieter residential streets along the Thames.",
    ],
    neighbourhoods: ["Staines town centre", "Staines riverside", "Laleham", "Stanwell", "Stanwell Moor", "Knowle Green"],
    local: {
      heading: "Homes and businesses in Staines",
      paragraphs: [
        "Homes in Staines range from riverside flats and new-build apartments in the town centre to family houses in Laleham and Knowle Green. Newer flats tend to have integrated appliances behind kitchen doors, so we often need to slide a dishwasher or fridge out of its housing to reach the fault.",
        "Staines town centre has restaurants, bars and cafés around the High Street and the riverside, while Stanwell's position next to Heathrow brings hotels and airport-related businesses within reach.",
      ],
    },
    keyServices: [
      { slug: "dishwasher-repair", reason: "Integrated dishwashers are standard in Staines's newer flats." },
      { slug: "fridge-freezer-repair", reason: "Integrated and freestanding fridge freezers in homes across TW18." },
      { slug: "bar-cooler-repair", reason: "For the bars and restaurants around the High Street and the riverside." },
    ],
    nearby: ["ashford", "heathrow", "feltham"],
  },
  {
    slug: "isleworth",
    name: "Isleworth",
    borough: "London Borough of Hounslow",
    postcodes: ["TW7"],
    travel: { miles: 5, minutes: "15–20" },
    summary: "Old Isleworth, Spring Grove, Osterley and the TW7 area.",
    intro: [
      "Isleworth is about fifteen to twenty minutes from Feltham, through Hounslow. We cover the whole TW7 area, from the riverside conservation area of Old Isleworth and the streets near Syon Park, to Spring Grove, St Margarets borders, and Osterley near Osterley Park.",
      "It's a part of the borough with a lot of character — historic riverside buildings alongside 1930s suburbs and newer developments near the hospital and the main road.",
    ],
    neighbourhoods: ["Old Isleworth", "Spring Grove", "Osterley", "Worton", "Busch Corner", "Isleworth town centre"],
    local: {
      heading: "Homes and businesses in Isleworth",
      paragraphs: [
        "Old Isleworth has period cottages and townhouses, often with compact or unusually shaped kitchens. Spring Grove and Osterley are mostly interwar family homes. Range cookers, built-in ovens and American fridge freezers are a familiar sight in the larger homes, and many need extra care getting in and out of tight spaces.",
        "Isleworth's riverside pubs and the cafés and restaurants along the main road and Twickenham Road also need reliable refrigeration.",
      ],
    },
    keyServices: [
      { slug: "electric-cooker-repair", reason: "Built-in and range cookers are common in Isleworth's larger family homes." },
      { slug: "american-fridge-repair", reason: "Large fridge freezers in Spring Grove and Osterley family kitchens." },
      { slug: "cellar-cooler-repair", reason: "For the historic riverside pubs in Old Isleworth." },
    ],
    nearby: ["hounslow", "twickenham", "richmond", "ealing"],
  },
  {
    slug: "hayes",
    name: "Hayes",
    borough: "London Borough of Hillingdon",
    postcodes: ["UB3", "UB4"],
    travel: { miles: 6, minutes: "20–25" },
    summary: "Hayes Town, Harlington, Yeading and the UB3 and UB4 areas.",
    intro: [
      "Hayes is about twenty minutes north of Feltham, via the A312 past Heathrow's eastern edge. We cover UB3 and UB4, including Hayes Town, the area around Hayes & Harlington station, Harlington, Botwell, Yeading and Hayes End.",
      "Hayes has changed a lot in recent years. Elizabeth line services and redevelopment around the Old Vinyl Factory and the canal side have brought new flats, alongside established housing estates and the industrial areas near the M4 and the Grand Union Canal.",
    ],
    neighbourhoods: ["Hayes Town", "Harlington", "Botwell", "Yeading", "Hayes End", "Wood End"],
    local: {
      heading: "Homes and businesses in Hayes",
      paragraphs: [
        "Hayes has everything from 1930s semis and council-built estates to brand-new apartment blocks. Newer flats come with integrated appliances, while family homes rely on freestanding washing machines and fridge freezers that see heavy use.",
        "Commercially, Hayes has industrial estates, warehouses and food businesses near the M4 and Heathrow, as well as shops and restaurants in Hayes Town. Cold rooms and commercial chillers are essential for many of them.",
      ],
    },
    keyServices: [
      { slug: "washing-machine-repair", reason: "Heavy family use across Hayes's established housing." },
      { slug: "cold-room-repair", reason: "For food businesses and industrial sites near the M4 and Heathrow." },
      { slug: "ice-machine-repair", reason: "For the hotels and catering businesses around Harlington and the airport." },
    ],
    nearby: ["southall", "heathrow", "hounslow"],
  },
  {
    slug: "southall",
    name: "Southall",
    borough: "London Borough of Ealing",
    postcodes: ["UB1", "UB2"],
    travel: { miles: 6, minutes: "20–25" },
    summary: "The Broadway, King Street, Norwood Green and the UB1 and UB2 areas.",
    intro: [
      "Southall is about twenty minutes north of our Feltham base, via Hounslow and Heston. We cover UB1 and UB2, from the Broadway and King Street to the residential streets around Southall Park, Norwood Green and Havelock Road.",
      "Southall's Broadway and South Road are among west London's best-known shopping streets, packed with restaurants, sweet centres, grocers and food wholesalers — and the refrigeration that keeps them trading.",
    ],
    neighbourhoods: ["The Broadway", "King Street", "Southall Green", "Norwood Green", "Havelock", "Dormers Wells"],
    local: {
      heading: "Homes and businesses in Southall",
      paragraphs: [
        "Most homes in Southall are Edwardian and interwar terraced and semi-detached houses, often with large households. Cookers and hobs work hard in kitchens that cook from scratch every day, and washing machines and fridge freezers see constant use.",
        "For businesses on the Broadway, South Road and King Street, refrigeration is critical. Display fridges, dairy cabinets, cold rooms and freezers need to stay at temperature through long trading hours.",
      ],
    },
    keyServices: [
      { slug: "gas-cooker-repair", reason: "Gas cookers and hobs get daily heavy use in Southall's family kitchens." },
      { slug: "display-fridge-repair", reason: "For the restaurants, sweet centres and grocers on the Broadway." },
      { slug: "cold-room-repair", reason: "For food wholesalers and restaurants needing walk-in storage." },
    ],
    nearby: ["hayes", "hounslow", "ealing"],
  },
  {
    slug: "richmond",
    name: "Richmond",
    borough: "London Borough of Richmond upon Thames",
    postcodes: ["TW9", "TW10"],
    travel: { miles: 7, minutes: "25–30" },
    summary: "Richmond town centre, Richmond Hill, Kew, Ham and Petersham.",
    intro: [
      "Richmond is around twenty-five minutes east of Feltham, via Twickenham. We cover TW9 and TW10: Richmond town centre and Richmond Green, Richmond Hill, Kew, North Sheen, and Ham and Petersham beside Richmond Park.",
      "With the river, the park and Kew Gardens on the doorstep, Richmond is one of London's most sought-after areas. Its homes and restaurants often have high-end appliances that need careful, knowledgeable repair.",
    ],
    neighbourhoods: ["Richmond town centre", "Richmond Hill", "Kew", "North Sheen", "Ham", "Petersham"],
    local: {
      heading: "Homes and businesses in Richmond",
      paragraphs: [
        "Richmond's Georgian, Victorian and Edwardian homes often have fitted kitchens with premium built-in appliances: integrated dishwashers and fridge freezers, induction hobs, and built-in ovens and microwaves. These usually justify a repair rather than replacement, and getting them in and out of fitted units takes care.",
        "Richmond's restaurants, cafés and pubs around the Green, the riverside and Kew Village rely on bar coolers, display fridges and cellar cooling.",
      ],
    },
    keyServices: [
      { slug: "microwave-repair", reason: "Built-in combination microwaves are common in Richmond's fitted kitchens." },
      { slug: "dishwasher-repair", reason: "Premium integrated dishwashers are usually worth repairing." },
      { slug: "bar-cooler-repair", reason: "For the pubs and restaurants around Richmond Green and the riverside." },
    ],
    nearby: ["twickenham", "isleworth", "kingston"],
  },
  {
    slug: "kingston",
    name: "Kingston upon Thames",
    borough: "Royal Borough of Kingston upon Thames",
    postcodes: ["KT1", "KT2"],
    travel: { miles: 7, minutes: "25–30" },
    summary: "Kingston town centre, Norbiton, Kingston Hill and the riverside.",
    intro: [
      "Kingston upon Thames is about twenty-five minutes south-east of Feltham, via Hampton and Kingston Bridge. We cover KT1 and KT2, including the town centre around the Market Place and the Bentall Centre, the riverside, Norbiton, Kingston Hill, and the streets around Canbury Gardens.",
      "Kingston is a major shopping and university town, with a large student and young-professional population alongside established family homes.",
    ],
    neighbourhoods: ["Kingston town centre", "Norbiton", "Kingston Hill", "Canbury", "Coombe", "Kingston riverside"],
    local: {
      heading: "Homes and businesses in Kingston",
      paragraphs: [
        "Kingston has a large number of flats and rented properties near the town centre and the university, as well as larger family homes towards Kingston Hill and Coombe. In rented homes, a quick and clear diagnosis helps landlords and tenants decide on a repair quickly.",
        "The town centre is packed with restaurants, bars and cafés around the Market Place and the riverside, which rely on bar coolers, display fridges and ice machines.",
      ],
    },
    keyServices: [
      { slug: "washing-machine-repair", reason: "Shared and rented homes put washing machines through heavy use." },
      { slug: "fridge-freezer-repair", reason: "Fridge breakdowns in flats and rented homes need a quick response." },
      { slug: "ice-machine-repair", reason: "For the bars and restaurants around the Market Place and the riverside." },
    ],
    nearby: ["richmond", "twickenham"],
  },
  {
    slug: "ealing",
    name: "Ealing",
    borough: "London Borough of Ealing",
    postcodes: ["W5", "W7", "W13"],
    travel: { miles: 8, minutes: "25–35" },
    summary: "Ealing Broadway, West Ealing, Hanwell, Northfields and Ealing Common.",
    intro: [
      "Ealing is around twenty-five to thirty-five minutes from our Feltham base, depending on traffic through Hounslow and Osterley. We cover W5, W7 and W13: Ealing Broadway and the town centre, Ealing Common, South Ealing and Northfields, West Ealing and Hanwell.",
      "Often called the \"Queen of the Suburbs\", Ealing has leafy streets of Victorian and Edwardian houses, Walpole Park and Pitzhanger Manor, and a busy town centre around the Broadway.",
    ],
    neighbourhoods: ["Ealing Broadway", "Ealing Common", "South Ealing", "Northfields", "West Ealing", "Hanwell"],
    local: {
      heading: "Homes and businesses in Ealing",
      paragraphs: [
        "Ealing's large period houses — many converted into flats — have every kind of kitchen, from compact galley layouts to big open-plan extensions with American fridge freezers, range cookers and integrated appliances.",
        "The town centre and West Ealing's Broadway have plenty of restaurants, cafés and independent food shops, while Hanwell and Northfields have busy local parades and pubs.",
      ],
    },
    keyServices: [
      { slug: "american-fridge-repair", reason: "American fridge freezers are popular in Ealing's larger kitchen extensions." },
      { slug: "electric-hob-repair", reason: "Induction hobs are increasingly common in renovated period homes." },
      { slug: "display-fridge-repair", reason: "For the cafés and independent food shops on Ealing and West Ealing Broadway." },
    ],
    nearby: ["southall", "isleworth", "hounslow"],
  },
  {
    slug: "heathrow",
    name: "Heathrow",
    borough: "London Borough of Hillingdon",
    postcodes: ["TW6", "UB7"],
    travel: { miles: 4, minutes: "10–15" },
    summary: "Businesses around Heathrow, Hatton Cross, Bath Road, Sipson and Harmondsworth.",
    intro: [
      "Heathrow is right next door to Feltham — the airport's southern perimeter is only a few minutes from our base. We cover the businesses and homes around it: Hatton Cross, the hotels along the Bath Road, Harlington, Sipson, Harmondsworth and Longford.",
      "Around the airport, refrigeration and catering equipment keeps hotels, restaurants, staff canteens and logistics operations running around the clock.",
    ],
    neighbourhoods: ["Hatton Cross", "Bath Road", "Harlington", "Sipson", "Harmondsworth", "Longford"],
    local: {
      heading: "Working around Heathrow",
      paragraphs: [
        "Most of our work around Heathrow is commercial: hotels, restaurants, catering kitchens and food storage on the landside of the airport and in the surrounding villages. Ice machines, cold rooms, display fridges and bar coolers are critical for businesses that serve travellers day and night.",
        "We also look after homes in the villages around the airport, such as Sipson, Harmondsworth and Harlington. [CONFIRM: we don't currently state whether you can work airside — remove or edit if you hold airside passes.]",
      ],
    },
    keyServices: [
      { slug: "ice-machine-repair", reason: "Hotels and bars along the Bath Road depend on a constant ice supply." },
      { slug: "cold-room-repair", reason: "For hotel kitchens, catering operations and food storage near the airport." },
      { slug: "air-conditioning-repair", reason: "For offices, hotels and commercial units around the airport." },
    ],
    nearby: ["feltham", "hayes", "hounslow", "staines"],
  },
];

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);
export const areaIndex = (): AreaIndexEntry[] => areas.map(({ slug, name, postcodes }) => ({ slug, name, postcodes }));
export const areaHref = (slug: string) => `/areas/${slug}/`;
export const featuredAreas = (limit = 12) => areas.slice(0, limit);
