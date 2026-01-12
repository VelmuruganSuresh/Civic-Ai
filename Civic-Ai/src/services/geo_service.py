from geopy.geocoders import Nominatim

class GeoService:
    def __init__(self):
        # It is best practice to make the user_agent unique to avoid blocks
        self.geolocator = Nominatim(user_agent="civic_ai_project_student_v1")

    def get_address(self, lat: float, long: float):
        try:
            if not lat or not long:
                return "Location not provided"
            
            # ✅ FIXED: Added timeout=10 (Seconds)
            # This gives the server enough time to respond without crashing.
            location = self.geolocator.reverse((lat, long), exactly_one=True, timeout=10)
            
            return location.address if location else "Unknown Location"
        except Exception as e:
            print(f"Geo Error: {e}")
            return "Unable to fetch address"

geo_engine = GeoService()