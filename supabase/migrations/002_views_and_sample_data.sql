-- Create views for auction system

-- Create view for auction overview
CREATE VIEW auction_overview AS
SELECT 
    a.id,
    a.name,
    a.location,
    a.auction_date,
    a.status,
    COUNT(DISTINCT c.id) as client_count,
    COUNT(DISTINCT l.id) as lot_count,
    COUNT(DISTINCT p.id) as photo_count,
    SUM(l.opening_bid) as total_opening_bid,
    a.created_at,
    a.updated_at
FROM auctions a
LEFT JOIN clients c ON a.id = c.auction_id
LEFT JOIN lots l ON c.id = l.client_id
LEFT JOIN lot_photos p ON l.id = p.lot_id
GROUP BY a.id, a.name, a.location, a.auction_date, a.status, a.created_at, a.updated_at;

-- Create view for client statistics
CREATE VIEW client_statistics AS
SELECT 
    c.id,
    c.name,
    c.company,
    c.auction_id,
    COUNT(l.id) as total_lots,
    COUNT(p.id) as total_photos,
    SUM(l.opening_bid) as total_value,
    COUNT(CASE WHEN l.needs_photos = true THEN 1 END) as lots_needing_photos,
    c.created_at,
    c.updated_at
FROM clients c
LEFT JOIN lots l ON c.id = l.client_id
LEFT JOIN lot_photos p ON l.id = p.lot_id
GROUP BY c.id, c.name, c.company, c.auction_id, c.created_at, c.updated_at;

-- Sample data for testing (remove in production)
INSERT INTO auctions (name, location, auction_date, description) VALUES 
('Mechelen Kantoor Ontruiming', 'Mechelen, België', '2025-03-15', 'Kantoormeubelen en apparatuur');
