-- Database Schema for MySQL

CREATE TABLE IF NOT EXISTS advertisers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    commission_rate DECIMAL(10, 4),
    avg_order_value DECIMAL(10, 2),
    conversion_rate DECIMAL(10, 4) NOT NULL DEFAULT 0,
    epc DECIMAL(10, 4) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE NOT NULL,
    advertiser_id INT,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    coupon_code VARCHAR(100),
    destination_url TEXT NOT NULL,
    tracking_url TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_expired BOOLEAN DEFAULT FALSE,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (advertiser_id) REFERENCES advertisers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS creatives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE NOT NULL,
    advertiser_id INT,
    type VARCHAR(50) NOT NULL,
    image_url TEXT,
    width INT,
    height INT,
    tracking_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (advertiser_id) REFERENCES advertisers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clicks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    offer_id INT,
    sub_id VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE
);

CREATE INDEX idx_advertisers_slug ON advertisers(slug);
CREATE INDEX idx_offers_advertiser_id ON offers(advertiser_id);
CREATE INDEX idx_offers_is_expired ON offers(is_expired);
CREATE INDEX idx_offers_end_date ON offers(end_date);
CREATE INDEX idx_creatives_advertiser_id ON creatives(advertiser_id);
CREATE INDEX idx_clicks_offer_id ON clicks(offer_id);
CREATE INDEX idx_clicks_created_at ON clicks(created_at);
