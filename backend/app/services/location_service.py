import math
import random

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS coordinates in kilometers."""
    radius_earth_km = 6371.0

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(radius_earth_km * c, 2)

def fuzz_coordinates(raw_lat: float, raw_lon: float, max_radius_km: float = 1.0) -> tuple[float, float]:
    """
    DPDP Act Compliance: Generates deterministic-looking pseudorandom obfuscated coordinates 
    within ~1km radius so exact user residences are never publicly exposed.
    """
    # 1 degree of latitude is ~111 km
    lat_offset_deg = (random.uniform(-max_radius_km, max_radius_km)) / 111.0
    lon_offset_deg = (random.uniform(-max_radius_km, max_radius_km)) / (
        111.0 * math.cos(math.radians(raw_lat))
    )

    fuzzy_lat = round(raw_lat + lat_offset_deg, 6)
    fuzzy_lon = round(raw_lon + lon_offset_deg, 6)
    return fuzzy_lat, fuzzy_lon

