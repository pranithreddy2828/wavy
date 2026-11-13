-- WAVY Initial Category Seed Data
USE wavy_db;

INSERT INTO categories (id, slug, name, description, icon_name, display_order, is_active) VALUES
(1, 'printing', 'Printing', 'Urgent documents, flyers, binding and Xerox assistance', 'printer', 1, TRUE),
(2, 'transportation', 'Transportation Coordination', 'Shared direction travel coordination and commuting assistance', 'car', 2, TRUE),
(3, 'education', 'Education', 'Academic assistance, study groups, and skill building', 'book-open', 3, TRUE),
(4, 'tutoring', 'Tutoring', 'Subject-specific tutoring, coding coaching, languages', 'graduation-cap', 4, TRUE),
(5, 'laptop-repair', 'Laptop Repair', 'Hardware diagnosis, OS installation, SSD upgrades, screen repairs', 'laptop', 5, TRUE),
(6, 'mobile-repair', 'Mobile Repair', 'Smartphone screen replacement, battery issues, software fixing', 'smartphone', 6, TRUE),
(7, 'home-repairs', 'Home Repairs', 'Plumbing, electrical, appliance diagnostics and handyman help', 'wrench', 7, TRUE),
(8, 'shopping-assistance', 'Shopping Assistance', 'Grocery procurement, local market shopping, urgent essentials', 'shopping-bag', 8, TRUE),
(9, 'parcel-assistance', 'Parcel Assistance', 'Local document or parcel pickup and intra-city drop coordination', 'package', 9, TRUE),
(10, 'delivery-coordination', 'Delivery Coordination', 'Non-commercial package delivery and peer-to-peer transport', 'truck', 10, TRUE),
(11, 'personal-assistance', 'Personal Assistance', 'Queue standing, event setup, elderly errand support', 'user-check', 11, TRUE),
(12, 'professional-services', 'Professional Services', 'Design, typing, notary navigation, translation, resume prep', 'briefcase', 12, TRUE),
(13, 'community-assistance', 'Community Assistance', 'Volunteering, neighbourhood civic tasks, lost & found', 'users', 13, TRUE),
(14, 'other', 'Other', 'General lawful assistance and peer-to-peer coordination', 'help-circle', 14, TRUE)
ON DUPLICATE KEY UPDATE 
    name=VALUES(name),
    description=VALUES(description),
    icon_name=VALUES(icon_name),
    display_order=VALUES(display_order),
    is_active=VALUES(is_active);
