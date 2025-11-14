interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationResult {
  coordinates: Coordinates;
  city: string;
  state: string;
  country: string;
  formattedAddress: string;
}

interface NearbyLocation {
  city: string;
  distance: number;
  coordinates: Coordinates;
}

// City coordinates database (major US cities for job locations)
export const CITY_COORDINATES: Record<string, Coordinates> = {
  "San Francisco, CA": { lat: 37.7749, lng: -122.4194 },
  "New York, NY": { lat: 40.7128, lng: -74.006 },
  "Los Angeles, CA": { lat: 34.0522, lng: -118.2437 },
  "Seattle, WA": { lat: 47.6062, lng: -122.3321 },
  "Boston, MA": { lat: 42.3601, lng: -71.0589 },
  "Austin, TX": { lat: 30.2672, lng: -97.7431 },
  "Chicago, IL": { lat: 41.8781, lng: -87.6298 },
  "Denver, CO": { lat: 39.7392, lng: -104.9903 },
  "Portland, OR": { lat: 45.5152, lng: -122.6784 },
  "Atlanta, GA": { lat: 33.7490, lng: -84.3880 },
  "Miami, FL": { lat: 25.7617, lng: -80.1918 },
  "Dallas, TX": { lat: 32.7767, lng: -96.7970 },
  "Phoenix, AZ": { lat: 33.4484, lng: -112.0740 },
  "Philadelphia, PA": { lat: 39.9526, lng: -75.1652 },
  "Houston, TX": { lat: 29.7604, lng: -95.3698 },
  "Detroit, MI": { lat: 42.3314, lng: -83.0458 },
  "San Diego, CA": { lat: 32.7157, lng: -117.1611 },
  "Minneapolis, MN": { lat: 44.9778, lng: -93.2650 },
  "Tampa, FL": { lat: 27.9506, lng: -82.4572 },
  "Orlando, FL": { lat: 28.5383, lng: -81.3792 },
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 First coordinate point
 * @param coord2 Second coordinate point
 * @returns Distance in miles
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get user's current geolocation
 * @param options Geolocation options
 * @returns Promise with coordinates
 */
export function getCurrentLocation(options?: PositionOptions): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    const defaultOptions: PositionOptions = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 300000, // 5 minutes
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let message = 'Location access failed';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        reject(new Error(message));
      },
      defaultOptions
    );
  });
}

/**
 * Find nearby cities within specified radius
 * @param userCoords User's coordinates
 * @param radiusMiles Search radius in miles
 * @returns Array of nearby locations sorted by distance
 */
export function findNearbyCities(
  userCoords: Coordinates,
  radiusMiles: number = 50
): NearbyLocation[] {
  return Object.entries(CITY_COORDINATES)
    .map(([city, coords]) => ({
      city,
      coordinates: coords,
      distance: calculateDistance(userCoords, coords),
    }))
    .filter((location) => location.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Get the closest city to user's location
 * @param userCoords User's coordinates
 * @returns Closest city information
 */
export function getClosestCity(userCoords: Coordinates): NearbyLocation | null {
  const nearby = findNearbyCities(userCoords, 500); // Large radius to find at least one city
  return nearby.length > 0 ? nearby[0] : null;
}

/**
 * Reverse geocoding to get location details (mock implementation)
 * In production, you would use Google Maps API, MapBox, or similar service
 * @param coords Coordinates to reverse geocode
 * @returns Promise with location details
 */
export async function reverseGeocode(coords: Coordinates): Promise<LocationResult> {
  // Mock implementation - in production use actual geocoding service
  const closestCity = getClosestCity(coords);

  if (closestCity) {
    const [city, state] = closestCity.city.split(', ');
    return {
      coordinates: coords,
      city,
      state,
      country: 'United States',
      formattedAddress: closestCity.city,
    };
  }

  // Fallback for unknown locations
  return {
    coordinates: coords,
    city: 'Unknown',
    state: 'Unknown',
    country: 'Unknown',
    formattedAddress: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
  };
}

/**
 * Check if location permission is granted
 * @returns Promise with permission status
 */
export async function checkLocationPermission(): Promise<PermissionState> {
  if (!navigator.permissions) {
    return 'prompt'; // Assume prompt if permissions API not available
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return permission.state;
  } catch {
    return 'prompt';
  }
}

/**
 * Format distance for display
 * @param miles Distance in miles
 * @returns Formatted distance string
 */
export function formatDistance(miles: number): string {
  if (miles < 1) {
    return 'Less than 1 mile';
  } else if (miles < 10) {
    return `${miles.toFixed(1)} miles`;
  } else {
    return `${Math.round(miles)} miles`;
  }
}

/**
 * Get prioritized location list based on user's location
 * @param userCoords User's coordinates (optional)
 * @param allLocations All available locations
 * @returns Sorted location array with nearby locations first
 */
export function getPrioritizedLocations(
  userCoords: Coordinates | null,
  allLocations: string[]
): string[] {
  const baseLocations = ['All Locations', 'Remote'];

  if (!userCoords) {
    return [
      ...baseLocations,
      ...allLocations.filter((loc) => !baseLocations.includes(loc)).sort(),
    ];
  }

  const nearbyLocations = findNearbyCities(userCoords, 100)
    .slice(0, 5)
    .map((loc) => loc.city)
    .filter((city) => allLocations.includes(city));

  const remainingLocations = allLocations
    .filter((loc) => !baseLocations.includes(loc) && !nearbyLocations.includes(loc))
    .sort();

  return [
    ...baseLocations,
    ...(nearbyLocations.length > 0 ? ['Near me (50 miles)', ...nearbyLocations] : []),
    ...(remainingLocations.length > 0 ? ['---', ...remainingLocations] : []),
  ];
}

/**
 * Location service class for managing location-related operations
 */
export class LocationService {
  private static instance: LocationService;
  private userLocation: Coordinates | null = null;
  private locationPermission: PermissionState = 'prompt';

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Initialize location service and request user location
   */
  async initialize(): Promise<void> {
    try {
      this.locationPermission = await checkLocationPermission();

      if (this.locationPermission === 'granted' || this.locationPermission === 'prompt') {
        this.userLocation = await getCurrentLocation();
        this.locationPermission = 'granted';
      }
    } catch (error) {
      this.locationPermission = 'denied';
      console.warn('Location initialization failed:', error);
    }
  }

  /**
   * Get current user location
   */
  getUserLocation(): Coordinates | null {
    return this.userLocation;
  }

  /**
   * Get location permission status
   */
  getPermissionStatus(): PermissionState {
    return this.locationPermission;
  }

  /**
   * Find jobs within radius of user's location
   */
  filterJobsByRadius(jobs: any[], radiusMiles: number = 50): any[] {
    if (!this.userLocation) return jobs;

    return jobs.filter((job) => {
      if (job.location === 'Remote') return true;

      const jobCoords = CITY_COORDINATES[job.location];
      if (!jobCoords) return false;

      const distance = calculateDistance(this.userLocation!, jobCoords);
      return distance <= radiusMiles;
    });
  }

  /**
   * Get sorted locations for dropdown
   */
  getSortedLocations(allLocations: string[]): string[] {
    return getPrioritizedLocations(this.userLocation, allLocations);
  }
}

export default LocationService;
