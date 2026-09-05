-- Ullavan Connect: Production Database Schema (PostgreSQL + PostGIS)
-- This is the reference schema for production deployment.
-- The included backend/ uses SQLite for easy local demo/run,
-- but the table design below matches it for a clean migration later.

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'buyer', 'secondary_buyer', 'admin')),
    preferred_language VARCHAR(10) DEFAULT 'ta',
    village VARCHAR(150),
    location GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES users(id),
    crop_name VARCHAR(100) NOT NULL,
    quantity_kg NUMERIC(10,2) NOT NULL,
    price_per_kg NUMERIC(10,2) NOT NULL,
    ai_suggested_price_min NUMERIC(10,2),
    ai_suggested_price_max NUMERIC(10,2),
    harvest_timestamp TIMESTAMP NOT NULL,
    freshness_tag VARCHAR(30),
    location GEOGRAPHY(POINT, 4326),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'rescued', 'expired')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listings(id),
    buyer_id INTEGER REFERENCES users(id),
    quantity_kg NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    order_status VARCHAR(20) DEFAULT 'placed' CHECK (order_status IN ('placed', 'confirmed', 'delivered', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE price_predictions (
    id SERIAL PRIMARY KEY,
    crop_name VARCHAR(100),
    region VARCHAR(100),
    predicted_min NUMERIC(10,2),
    predicted_max NUMERIC(10,2),
    model_version VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE demand_forecasts (
    id SERIAL PRIMARY KEY,
    crop_name VARCHAR(100),
    region VARCHAR(100),
    forecast_date DATE,
    predicted_demand_kg NUMERIC(10,2),
    trend VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rescue_alerts (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listings(id),
    triggered_reason VARCHAR(100),
    discount_percent NUMERIC(5,2),
    notified_buyer_ids INTEGER[],
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'expired')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_listings_location ON listings USING GIST (location);
CREATE INDEX idx_users_location ON users USING GIST (location);
