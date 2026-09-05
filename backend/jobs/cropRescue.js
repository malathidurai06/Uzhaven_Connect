const cron = require("node-cron");
const db = require("../db/init");

// Crop Rescue System:
// Runs every hour. Any 'active' listing whose produce is older than RESCUE_THRESHOLD_HOURS
// and still unsold gets flagged, discounted, and a rescue_alert row is created.
// In production, this is also where you'd trigger FCM push / SMS to secondary buyers
// (hotels, restaurants, supermarkets, NGOs) within the hyperlocal radius.

const RESCUE_THRESHOLD_HOURS = 48;
const RESCUE_DISCOUNT_PERCENT = 25;

function runCropRescueCheck() {
  const cutoff = new Date(Date.now() - RESCUE_THRESHOLD_HOURS * 60 * 60 * 1000).toISOString();

  const staleListing = db.prepare(`
    SELECT * FROM listings
    WHERE status = 'active' AND harvest_timestamp <= ?
  `).all(cutoff);

  staleListing.forEach((listing) => {
    const discountedPrice = +(listing.price_per_kg * (1 - RESCUE_DISCOUNT_PERCENT / 100)).toFixed(2);

    db.prepare("UPDATE listings SET price_per_kg = ?, status = 'rescued' WHERE id = ?")
      .run(discountedPrice, listing.id);

    db.prepare(`
      INSERT INTO rescue_alerts (listing_id, triggered_reason, discount_percent, status)
      VALUES (?, ?, ?, 'sent')
    `).run(listing.id, `Unsold for over ${RESCUE_THRESHOLD_HOURS}h`, RESCUE_DISCOUNT_PERCENT);

    // TODO (production): fetch secondary buyers within radius and send FCM/SMS alerts here.
    console.log(`[Crop Rescue] Listing #${listing.id} (${listing.crop_name}) discounted ${RESCUE_DISCOUNT_PERCENT}% and alert sent.`);
  });

  if (staleListing.length === 0) {
    console.log("[Crop Rescue] No stale listings found in this check.");
  }
}

function startCropRescueJob() {
  // Runs at the top of every hour. Change schedule as needed for your demo.
  cron.schedule("0 * * * *", runCropRescueCheck);
  console.log("[Crop Rescue] Scheduled job started (runs hourly).");
}

module.exports = { startCropRescueJob, runCropRescueCheck };
