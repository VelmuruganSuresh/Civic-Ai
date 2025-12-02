from geopy.geocoders import Nominatim

class GeoService:
    def __init__(self):
        self.geolocator = Nominatim(user_agent="civic_ai_app")

    def get_address(self, lat: float, long: float):
        try:
            if not lat or not long:
                return "Location not provided"
            
            location = self.geolocator.reverse((lat, long), exactly_one=True)
            return location.address if location else "Unknown Location"
        except Exception as e:
            print(f"Geo Error: {e}")
            return "Unable to fetch address"

geo_engine = GeoService()