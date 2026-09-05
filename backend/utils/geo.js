// Haversine distance in km between two lat/long points.
// Used for hyperlocal "nearby listings" matching without needing PostGIS in the SQLite demo.
function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function freshnessTag(harvestTimestamp) {
  const harvestDate = new Date(harvestTimestamp);
  const now = new Date();
  const diffHours = (now - harvestDate) / (1000 * 60 * 60);
  if (diffHours < 24) return "Harvested Today";
  if (diffHours < 48) return "1 Day Old";
  if (diffHours < 72) return "2 Days Old";
  return "2+ Days Old";
}

module.exports = { haversineKm, freshnessTag };
