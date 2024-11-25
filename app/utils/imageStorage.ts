export const saveImageUrls = async (
  storageKey: string,
  urls: string[]
): Promise<void> => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(urls));
  } catch (error) {
    console.error("Error saving image URLs:", error);
  }
};

const inner_sydney = [
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/anzac_bridge_westbound.jpeg",
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/anzac_bridge_eastbound.jpeg",
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/west_tower_anzac_br_looking_east.jpeg",
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/anzac_parade_moore_park.jpeg",
];

const sydney_north = [
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/pacific_highway_chatswood.jpeg",
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/pennant_hills_road_beecroft.jpeg",
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/pennant_hills_road_thornleigh.jpeg",
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/ryde_bridge_ryde.jpeg",
];

const sydney_west = [
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/m4_western_motorway_auburn.jpeg",
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/m4_western_motorway_emu_plains.jpeg",
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/m4_western_motorway_mays_hill.jpeg",
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/m4_western_motorway_minchinbury.jpeg",
];

const sydney_south = [
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/m5_liverpool.jpeg",
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/m5_milperra.jpeg",
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/m5_padstow.jpeg",
  "https://webcams.transport.nsw.gov.au/livetraffic-webcams/cameras/m5_m7_camden_valley.jpeg",
];

const defaultImageUrls: { [key: string]: string[] } = {
  inner_sydney: inner_sydney,
  sydney_north: sydney_north,
  sydney_west: sydney_west,
  sydney_south: sydney_south,
};

export const loadImageUrls = async (storageKey: string): Promise<string[]> => {
  const urls = localStorage.getItem(storageKey);
  return urls ? JSON.parse(urls) : defaultImageUrls[storageKey] || [];
};
