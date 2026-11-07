export interface AddressSuggestion {
  id: string;
  mainText: string;
  secondaryText: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CountryItem {
  name: string;
  code: string;
  dialCode: string;
  aliases?: string[];
}

export const COUNTRIES: CountryItem[] = [
  { name: "United States", code: "US", dialCode: "+1", aliases: ["usa", "us", "america", "united states of america"] },
  { name: "United Kingdom", code: "GB", dialCode: "+44", aliases: ["uk", "gb", "great britain", "england", "scotland", "wales", "northern ireland"] },
  { name: "Nigeria", code: "NG", dialCode: "+234", aliases: ["ng", "naija"] },
  { name: "Canada", code: "CA", dialCode: "+1", aliases: ["ca"] },
  { name: "Ghana", code: "GH", dialCode: "+233", aliases: ["gh"] },
  { name: "South Africa", code: "ZA", dialCode: "+27", aliases: ["za", "rsa"] },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", aliases: ["uae", "dubai", "abu dhabi"] },
  { name: "Australia", code: "AU", dialCode: "+61", aliases: ["au", "aus"] },
  { name: "France", code: "FR", dialCode: "+33", aliases: ["fr"] },
  { name: "Germany", code: "DE", dialCode: "+49", aliases: ["de", "deutschland"] },
  { name: "Ireland", code: "IE", dialCode: "+353", aliases: ["ie", "eire"] },
  { name: "Netherlands", code: "NL", dialCode: "+31", aliases: ["nl", "holland"] },
  { name: "Italy", code: "IT", dialCode: "+39", aliases: ["it"] },
  { name: "Spain", code: "ES", dialCode: "+34", aliases: ["es"] },
  { name: "Belgium", code: "BE", dialCode: "+32", aliases: ["be"] },
  { name: "Switzerland", code: "CH", dialCode: "+41", aliases: ["ch"] },
  { name: "Sweden", code: "SE", dialCode: "+46", aliases: ["se"] },
  { name: "Norway", code: "NO", dialCode: "+47", aliases: ["no"] },
  { name: "Denmark", code: "DK", dialCode: "+45", aliases: ["dk"] },
  { name: "Kenya", code: "KE", dialCode: "+254", aliases: ["ke"] },
  { name: "Afghanistan", code: "AF", dialCode: "+93" },
  { name: "Albania", code: "AL", dialCode: "+355" },
  { name: "Algeria", code: "DZ", dialCode: "+213" },
  { name: "Andorra", code: "AD", dialCode: "+376" },
  { name: "Angola", code: "AO", dialCode: "+244" },
  { name: "Antigua and Barbuda", code: "AG", dialCode: "+1" },
  { name: "Argentina", code: "AR", dialCode: "+54" },
  { name: "Armenia", code: "AM", dialCode: "+374" },
  { name: "Austria", code: "AT", dialCode: "+43" },
  { name: "Azerbaijan", code: "AZ", dialCode: "+994" },
  { name: "Bahamas", code: "BS", dialCode: "+1" },
  { name: "Bahrain", code: "BH", dialCode: "+973" },
  { name: "Bangladesh", code: "BD", dialCode: "+880" },
  { name: "Barbados", code: "BB", dialCode: "+1" },
  { name: "Benin", code: "BJ", dialCode: "+229" },
  { name: "Botswana", code: "BW", dialCode: "+267" },
  { name: "Brazil", code: "BR", dialCode: "+55" },
  { name: "Bulgaria", code: "BG", dialCode: "+359" },
  { name: "Burkina Faso", code: "BF", dialCode: "+226" },
  { name: "Cameroon", code: "CM", dialCode: "+237" },
  { name: "Chile", code: "CL", dialCode: "+56" },
  { name: "China", code: "CN", dialCode: "+86" },
  { name: "Colombia", code: "CO", dialCode: "+57" },
  { name: "Costa Rica", code: "CR", dialCode: "+506" },
  { name: "Cote d'Ivoire", code: "CI", dialCode: "+225", aliases: ["ivory coast"] },
  { name: "Croatia", code: "HR", dialCode: "+385" },
  { name: "Cyprus", code: "CY", dialCode: "+357" },
  { name: "Czech Republic", code: "CZ", dialCode: "+420", aliases: ["czechia"] },
  { name: "Democratic Republic of the Congo", code: "CD", dialCode: "+243", aliases: ["drc", "congo"] },
  { name: "Dominican Republic", code: "DO", dialCode: "+1" },
  { name: "Ecuador", code: "EC", dialCode: "+593" },
  { name: "Egypt", code: "EG", dialCode: "+20" },
  { name: "Estonia", code: "EE", dialCode: "+372" },
  { name: "Ethiopia", code: "ET", dialCode: "+251" },
  { name: "Finland", code: "FI", dialCode: "+358" },
  { name: "Gabon", code: "GA", dialCode: "+241" },
  { name: "Gambia", code: "GM", dialCode: "+220" },
  { name: "Georgia", code: "GE", dialCode: "+995" },
  { name: "Greece", code: "GR", dialCode: "+30" },
  { name: "Guinea", code: "GN", dialCode: "+224" },
  { name: "Guyana", code: "GY", dialCode: "+592" },
  { name: "Hong Kong", code: "HK", dialCode: "+852" },
  { name: "Hungary", code: "HU", dialCode: "+36" },
  { name: "Iceland", code: "IS", dialCode: "+354" },
  { name: "India", code: "IN", dialCode: "+91" },
  { name: "Indonesia", code: "ID", dialCode: "+62" },
  { name: "Israel", code: "IL", dialCode: "+972" },
  { name: "Jamaica", code: "JM", dialCode: "+1" },
  { name: "Japan", code: "JP", dialCode: "+81" },
  { name: "Jordan", code: "JO", dialCode: "+962" },
  { name: "Kuwait", code: "KW", dialCode: "+965" },
  { name: "Latvia", code: "LV", dialCode: "+371" },
  { name: "Lebanon", code: "LB", dialCode: "+961" },
  { name: "Lesotho", code: "LS", dialCode: "+266" },
  { name: "Liberia", code: "LR", dialCode: "+231" },
  { name: "Lithuania", code: "LT", dialCode: "+370" },
  { name: "Luxembourg", code: "LU", dialCode: "+352" },
  { name: "Madagascar", code: "MG", dialCode: "+261" },
  { name: "Malawi", code: "MW", dialCode: "+265" },
  { name: "Malaysia", code: "MY", dialCode: "+60" },
  { name: "Maldives", code: "MV", dialCode: "+960" },
  { name: "Mali", code: "ML", dialCode: "+223" },
  { name: "Malta", code: "MT", dialCode: "+356" },
  { name: "Mauritius", code: "MU", dialCode: "+230" },
  { name: "Mexico", code: "MX", dialCode: "+52" },
  { name: "Monaco", code: "MC", dialCode: "+377" },
  { name: "Morocco", code: "MA", dialCode: "+212" },
  { name: "Mozambique", code: "MZ", dialCode: "+258" },
  { name: "Namibia", code: "NA", dialCode: "+264" },
  { name: "New Zealand", code: "NZ", dialCode: "+64", aliases: ["nz"] },
  { name: "Niger", code: "NE", dialCode: "+227" },
  { name: "Oman", code: "OM", dialCode: "+968" },
  { name: "Pakistan", code: "PK", dialCode: "+92" },
  { name: "Panama", code: "PA", dialCode: "+507" },
  { name: "Peru", code: "PE", dialCode: "+51" },
  { name: "Philippines", code: "PH", dialCode: "+63" },
  { name: "Poland", code: "PL", dialCode: "+48" },
  { name: "Portugal", code: "PT", dialCode: "+351" },
  { name: "Qatar", code: "QA", dialCode: "+974" },
  { name: "Romania", code: "RO", dialCode: "+40" },
  { name: "Rwanda", code: "RW", dialCode: "+250" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966", aliases: ["ksa"] },
  { name: "Senegal", code: "SN", dialCode: "+221" },
  { name: "Serbia", code: "RS", dialCode: "+381" },
  { name: "Seychelles", code: "SC", dialCode: "+248" },
  { name: "Sierra Leone", code: "SL", dialCode: "+232" },
  { name: "Singapore", code: "SG", dialCode: "+65" },
  { name: "Slovakia", code: "SK", dialCode: "+421" },
  { name: "Slovenia", code: "SI", dialCode: "+386" },
  { name: "South Korea", code: "KR", dialCode: "+82", aliases: ["korea"] },
  { name: "Sri Lanka", code: "LK", dialCode: "+94" },
  { name: "Taiwan", code: "TW", dialCode: "+886" },
  { name: "Tanzania", code: "TZ", dialCode: "+255" },
  { name: "Thailand", code: "TH", dialCode: "+66" },
  { name: "Togo", code: "TG", dialCode: "+228" },
  { name: "Trinidad and Tobago", code: "TT", dialCode: "+1" },
  { name: "Tunisia", code: "TN", dialCode: "+216" },
  { name: "Turkey", code: "TR", dialCode: "+90", aliases: ["turkiye"] },
  { name: "Uganda", code: "UG", dialCode: "+256" },
  { name: "Ukraine", code: "UA", dialCode: "+380" },
  { name: "Uruguay", code: "UY", dialCode: "+598" },
  { name: "Vietnam", code: "VN", dialCode: "+84" },
  { name: "Zambia", code: "ZM", dialCode: "+260" },
  { name: "Zimbabwe", code: "ZW", dialCode: "+263" },
];

export const STATES_BY_COUNTRY: Record<string, string[]> = {
  "United States": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
    "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
    "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
    "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming",
  ],
  "United Kingdom": [
    "Greater London", "England", "Scotland", "Wales", "Northern Ireland", "Greater Manchester",
    "West Midlands", "West Yorkshire", "South Yorkshire", "Merseyside", "Tyne and Wear",
    "Essex", "Kent", "Surrey", "Hampshire", "Hertfordshire", "Lancashire", "Cheshire",
    "Berkshire", "Buckinghamshire", "Cambridgeshire", "Devon", "Dorset", "East Sussex",
    "West Sussex", "Gloucestershire", "Leicestershire", "Lincolnshire", "Norfolk",
    "Northamptonshire", "Nottinghamshire", "Oxfordshire", "Somerset", "Staffordshire",
    "Suffolk", "Warwickshire", "Wiltshire", "Worcestershire", "Bristol", "Edinburgh",
    "Glasgow", "Cardiff", "Belfast",
  ],
  Nigeria: [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
    "Taraba", "Yobe", "Zamfara",
  ],
  Canada: [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
    "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
    "Quebec", "Saskatchewan", "Yukon",
  ],
  Australia: [
    "New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia",
    "Tasmania", "Australian Capital Territory", "Northern Territory",
  ],
  Ghana: [
    "Greater Accra", "Ashanti", "Western", "Eastern", "Central", "Northern", "Volta",
    "Bono", "Bono East", "Ahafo", "Upper East", "Upper West",
  ],
  "South Africa": [
    "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State",
    "Limpopo", "Mpumalanga", "North West", "Northern Cape",
  ],
  "United Arab Emirates": [
    "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain",
  ],
  Ireland: [
    "Dublin", "Cork", "Galway", "Limerick", "Waterford", "Kildare", "Meath", "Wicklow",
    "Wexford", "Kerry", "Clare", "Tipperary", "Donegal", "Louth", "Mayo", "Westmeath",
  ],
  Germany: [
    "Berlin", "Bavaria", "Baden-Württemberg", "North Rhine-Westphalia", "Hesse",
    "Saxony", "Lower Saxony", "Hamburg", "Bremen", "Brandenburg", "Schleswig-Holstein",
  ],
  France: [
    "Île-de-France", "Auvergne-Rhône-Alpes", "Nouvelle-Aquitaine", "Occitanie",
    "Hauts-de-France", "Provence-Alpes-Côte d'Azur", "Grand Est", "Pays de la Loire",
    "Brittany", "Normandy",
  ],
  Netherlands: [
    "North Holland", "South Holland", "Utrecht", "North Brabant", "Gelderland",
    "Overijssel", "Limburg", "Groningen", "Flevoland", "Zeeland",
  ],
  Kenya: [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Uasin Gishu", "Machakos",
  ],
};

export const POPULAR_CITIES_BY_COUNTRY: Record<string, string[]> = {
  "United States": [
    "New York", "Los Angeles", "Chicago", "Houston", "Atlanta", "Dallas", "Miami",
    "Washington", "Philadelphia", "Boston", "San Francisco", "Seattle", "Phoenix",
    "Austin", "Baltimore", "Charlotte", "Denver", "Detroit", "Las Vegas", "Newark",
    "Orlando", "San Diego", "Minneapolis", "Tampa",
  ],
  "United Kingdom": [
    "London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Bristol",
    "Sheffield", "Edinburgh", "Leicester", "Coventry", "Bradford", "Cardiff", "Belfast",
    "Nottingham", "Newcastle upon Tyne", "Southampton", "Reading", "Milton Keynes",
    "Brighton", "Oxford", "Cambridge", "Croydon", "Watford", "Slough",
  ],
  Nigeria: [
    "Lagos", "Abuja", "Ibadan", "Port Harcourt", "Abeokuta", "Kano", "Enugu", "Benin City",
    "Ikoyi", "Victoria Island", "Lekki", "Ikeja", "Surulere", "Yaba", "Ajah", "Warri",
    "Uyo", "Calabar", "Owerri", "Asaba", "Akure", "Osogbo", "Ilorin", "Kaduna", "Jos",
  ],
  Canada: [
    "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Mississauga",
    "Winnipeg", "Brampton", "Hamilton", "Quebec City", "Halifax", "Surrey", "London",
  ],
  Ghana: ["Accra", "Kumasi", "Tema", "Takoradi", "Tamale", "Cape Coast"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Sandton", "Port Elizabeth"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Al Ain"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra"],
  Ireland: ["Dublin", "Cork", "Galway", "Limerick", "Waterford", "Drogheda"],
  France: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Bordeaux", "Lille"],
  Germany: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Stuttgart", "Düsseldorf"],
  Netherlands: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
};

export function filterCountries(query: string): CountryItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return COUNTRIES;

  const exactAndStartsWith: CountryItem[] = [];
  const includesMatch: CountryItem[] = [];

  for (const country of COUNTRIES) {
    const nameLower = country.name.toLowerCase();
    const codeLower = country.code.toLowerCase();
    const aliasMatched = country.aliases?.some((a) => a.toLowerCase().startsWith(q));

    if (nameLower.startsWith(q) || codeLower === q || aliasMatched) {
      exactAndStartsWith.push(country);
    } else if (
      nameLower.includes(q) ||
      country.aliases?.some((a) => a.toLowerCase().includes(q))
    ) {
      includesMatch.push(country);
    }
  }

  return [...exactAndStartsWith, ...includesMatch];
}

export function matchCanonicalCountry(input: string): string {
  const q = input.trim().toLowerCase();
  if (!q) return "";
  for (const c of COUNTRIES) {
    if (
      c.name.toLowerCase() === q ||
      c.code.toLowerCase() === q ||
      c.aliases?.some((a) => a.toLowerCase() === q)
    ) {
      return c.name;
    }
  }
  return input.trim();
}

export function filterStatesForCountry(country: string, query: string): string[] {
  const canonical = matchCanonicalCountry(country);
  const list = STATES_BY_COUNTRY[canonical] || [];
  const q = query.trim().toLowerCase();
  if (!q) return list;

  const starts = list.filter((s) => s.toLowerCase().startsWith(q));
  const rest = list.filter(
    (s) => !s.toLowerCase().startsWith(q) && s.toLowerCase().includes(q),
  );
  return [...starts, ...rest];
}

export function filterCitiesForCountry(country: string, query: string): string[] {
  const canonical = matchCanonicalCountry(country);
  const list = POPULAR_CITIES_BY_COUNTRY[canonical] || [];
  const q = query.trim().toLowerCase();
  if (!q) return list;

  const starts = list.filter((c) => c.toLowerCase().startsWith(q));
  const rest = list.filter(
    (c) => !c.toLowerCase().startsWith(q) && c.toLowerCase().includes(q),
  );
  return [...starts, ...rest];
}

/**
 * Live geocoding search for street addresses, cities, and postal codes worldwide
 * using Photon (OpenStreetMap) with fallback to Nominatim.
 */
export async function searchAddressSuggestions(
  query: string,
  countryHint?: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const fullQuery =
    countryHint && !trimmed.toLowerCase().includes(countryHint.toLowerCase())
      ? `${trimmed}, ${countryHint}`
      : trimmed;

  // 1. Try Photon (fast OpenStreetMap autocomplete API)
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(fullQuery)}&limit=6&lang=en`;
    const res = await fetch(url, { signal });
    if (res.ok) {
      const data = await res.json();
      const features = Array.isArray(data?.features) ? data.features : [];
      const results: AddressSuggestion[] = [];
      const seen = new Set<string>();

      for (const feat of features) {
        const p = feat?.properties;
        if (!p) continue;

        const houseNumber = p.housenumber || "";
        const streetName = p.street || p.name || "";
        const street =
          houseNumber && streetName && !streetName.startsWith(houseNumber)
            ? `${houseNumber} ${streetName}`
            : streetName || houseNumber || "";

        const city =
          p.city || p.town || p.village || p.suburb || p.district || p.locality || p.county || "";
        const state = p.state || p.county || "";
        const zip = p.postcode || "";
        const country = matchCanonicalCountry(p.country || "") || p.country || "";

        if (!street && !city) continue;

        const mainText = street || city;
        const secondaryParts = [
          street ? city : "",
          state,
          zip,
          country,
        ].filter(Boolean);
        const secondaryText = secondaryParts.join(", ");

        const dedupeKey = `${mainText}|${secondaryText}`.toLowerCase();
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);

        results.push({
          id: `${p.osm_id || results.length}-${dedupeKey}`,
          mainText,
          secondaryText,
          street: street || mainText,
          city: city || state || "",
          state,
          zip,
          country,
        });
      }

      if (results.length > 0) return results;
    }
  } catch (err: any) {
    if (err?.name === "AbortError") return [];
  }

  // 2. Fallback to OpenStreetMap Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&accept-language=en&q=${encodeURIComponent(fullQuery)}`;
    const res = await fetch(url, {
      signal,
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const items = await res.json();
      if (Array.isArray(items)) {
        return items.map((item: any, idx: number) => {
          const addr = item.address || {};
          const houseNumber = addr.house_number || "";
          const road = addr.road || addr.pedestrian || addr.suburb || item.name || "";
          const street =
            houseNumber && road ? `${houseNumber} ${road}` : road || houseNumber || "";
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.municipality ||
            addr.suburb ||
            addr.county ||
            "";
          const state = addr.state || addr.region || addr.county || "";
          const zip = addr.postcode || "";
          const country =
            matchCanonicalCountry(addr.country || "") || addr.country || "";

          const mainText = street || city || (item.display_name || "").split(",")[0];
          const secondaryText = [city, state, zip, country].filter(Boolean).join(", ");

          return {
            id: `${item.place_id || idx}`,
            mainText,
            secondaryText,
            street: street || mainText,
            city,
            state,
            zip,
            country,
          };
        });
      }
    }
  } catch (err: any) {
    if (err?.name === "AbortError") return [];
  }

  return [];
}

/**
 * Uses the browser's Geolocation API + Reverse Geocoding to detect the user's current address.
 */
export async function detectAddressFromGeolocation(): Promise<Partial<AddressSuggestion>> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    throw new Error("Geolocation is not supported by your browser.");
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });
  });

  const { latitude, longitude } = position.coords;

  // 1. Try OpenStreetMap Nominatim Reverse Geocoding
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`,
      { headers: { Accept: "application/json" } },
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data?.address || {};
      const houseNumber = addr.house_number || "";
      const road = addr.road || addr.pedestrian || addr.neighbourhood || addr.suburb || "";
      const street =
        houseNumber && road ? `${houseNumber} ${road}` : road || houseNumber || "";
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.suburb ||
        addr.county ||
        "";
      const state = addr.state || addr.region || addr.county || "";
      const zip = addr.postcode || "";
      const country =
        matchCanonicalCountry(addr.country || "") || addr.country || "";

      if (city || country) {
        return { street, city, state, zip, country };
      }
    }
  } catch {
    // Fallback below
  }

  // 2. Fallback to BigDataCloud free client-side reverse geocode
  const fallbackRes = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
  );
  if (!fallbackRes.ok) {
    throw new Error("Unable to resolve address from your location.");
  }
  const bdc = await fallbackRes.json();
  return {
    street: bdc.locality || "",
    city: bdc.city || bdc.locality || "",
    state: bdc.principalSubdivision || "",
    zip: bdc.postcode || "",
    country: matchCanonicalCountry(bdc.countryName || "") || bdc.countryName || "",
  };
}
