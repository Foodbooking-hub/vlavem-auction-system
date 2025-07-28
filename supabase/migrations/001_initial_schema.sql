-- Vlavem.com Auction Management Database Schema
-- Initial migration for auction system

-- Create auctions table
CREATE TABLE auctions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    auction_date DATE,
    description TEXT,
    status VARCHAR(50) DEFAULT 'in_bewerking',
    drive_folder_id VARCHAR(255),
    drive_folder_url VARCHAR(500),
    settings JSONB DEFAULT '{}',
    statistics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    auction_id INTEGER REFERENCES auctions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    contact VARCHAR(255),
    address TEXT,
    notes TEXT,
    settings JSONB DEFAULT '{}',
    statistics JSONB DEFAULT '{}',
    drive_subfolder_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lots table
CREATE TABLE lots (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    opening_bid DECIMAL(10,2) DEFAULT 1.00,
    btw VARCHAR(20),
    condition VARCHAR(50) DEFAULT 'gebruikt',
    notes TEXT,
    ai_analysis JSONB DEFAULT '{}',
    needs_photos BOOLEAN DEFAULT false,
    drive_folder VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, number)
);

-- Create lot_photos table
CREATE TABLE lot_photos (
    id SERIAL PRIMARY KEY,
    lot_id INTEGER REFERENCES lots(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    drive_file_id VARCHAR(255),
    drive_url VARCHAR(500),
    original_url VARCHAR(500),
    source VARCHAR(50) DEFAULT 'upload', -- 'upload', 'web_import', 'camera'
    upload_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true
);

-- Create indexes for performance
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_clients_auction_id ON clients(auction_id);
CREATE INDEX idx_lots_client_id ON lots(client_id);
CREATE INDEX idx_lots_category ON lots(category);
CREATE INDEX idx_lot_photos_lot_id ON lot_photos(lot_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_auctions_updated_at BEFORE UPDATE ON auctions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lots_updated_at BEFORE UPDATE ON lots 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, description) VALUES 
('opbergkasten', 'Diverse opbergkasten en kledingkasten'),
('bureau', 'Bureaus, bureaustoelen en kantoormeubelen'),
('kantoormateriaal', 'Kantoorbenodigdheden en apparatuur'),
('meubelen', 'Algemene meubelen en inrichting'),
('alu opbergkoffer', 'Aluminium transportkoffers en opbergboxen');

-- Comments for documentation
COMMENT ON TABLE auctions IS 'Main auction events - each auction can have multiple clients';
COMMENT ON TABLE clients IS 'Clients within auctions - each client has their own lots and numbering';
COMMENT ON TABLE lots IS 'Individual auction lots - numbered per client';
COMMENT ON TABLE lot_photos IS 'Photos for each lot - stored in Google Drive';
COMMENT ON COLUMN lots.number IS 'Lot number within client (starts at 1 for each client)';
COMMENT ON COLUMN lot_photos.source IS 'Source of photo: upload, web_import, camera';
COMMENT ON COLUMN lots.ai_analysis IS 'AI analysis data including import source and original data';
