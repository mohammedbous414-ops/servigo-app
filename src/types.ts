export type Language = 'ar' | 'darija' | 'fr' | 'en';

export type UserRole = 'rider' | 'driver' | 'admin' | 'website';

export type VehicleCategory = 'economy' | 'comfort' | 'taxi' | 'moto' | 'cargo';

export interface LocationPoint {
  address: string;
  city: string;
  lat: number;
  lng: number;
  name?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
  tripsCount: number;
  carModel: string;
  carColor: string;
  plateNumber: string;
  category: VehicleCategory;
  isOnline: boolean;
  status: 'idle' | 'busy' | 'offline';
  lat: number;
  lng: number;
  walletBalance: number;
  verified: boolean;
  cinNumber?: string;
  licenseNumber?: string;
}

export type RideStatus =
  | 'searching'
  | 'negotiating'
  | 'accepted'
  | 'en_route_pickup'
  | 'in_trip'
  | 'completed'
  | 'cancelled';

export interface DriverOffer {
  id: string;
  requestId: string;
  driverId: string;
  driverName: string;
  driverPhoto: string;
  driverRating: number;
  driverTrips: number;
  carModel: string;
  carColor: string;
  plateNumber: string;
  proposedFare: number;
  etaMinutes: number;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
}

export interface RideRequest {
  id: string;
  riderName: string;
  riderPhone: string;
  riderPhoto?: string;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  category: VehicleCategory;
  proposedFare: number;
  estimatedDistanceKm: number;
  estimatedDurationMin: number;
  note?: string;
  paymentMethod: 'cash' | 'wallet';
  status: RideStatus;
  assignedDriverId?: string;
  acceptedFare?: number;
  createdAt: string;
  promoCodeApplied?: string;
  discountMAD?: number;
  offers: DriverOffer[];
}

export interface ChatMessage {
  id: string;
  rideId: string;
  senderRole: 'rider' | 'driver';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  amountMAD: number;
  paymentMethod: 'cih' | 'attijari' | 'gbp' | 'cashplus' | 'orange_money';
  accountDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ToastAlert {
  id: string;
  title: string;
  body: string;
  type: 'success' | 'info' | 'warning';
  timestamp: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  userRole: UserRole;
  amount: number;
  type: 'topup' | 'ride_payment' | 'driver_earning' | 'commission_fee' | 'cashback' | 'withdrawal';
  description: string;
  timestamp: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  maxMAD: number;
  active: boolean;
  usageCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  role: UserRole;
  authProvider: 'phone' | 'google' | 'email';
  isPhoneVerified: boolean;
  savedAddresses?: { name: string; address: string; lat: number; lng: number }[];
  emergencyContact?: string;
  rating: number;
  totalTrips: number;
  createdAt: string;
}

export type AuthModalMode = 'login' | 'signup' | 'otp' | 'forgot_password';

export interface TripReceipt {
  id: string;
  rideId: string;
  date: string;
  riderName: string;
  driverName: string;
  pickupAddress: string;
  dropoffAddress: string;
  baseFareMAD: number;
  distanceKm: number;
  durationMin: number;
  discountMAD: number;
  finalFareMAD: number;
  paymentMethod: 'cash' | 'wallet';
  driverCar: string;
  plateNumber: string;
  tvaMAD: number;
}

export interface DriverKycStatus {
  cinFrontUrl?: string;
  cinBackUrl?: string;
  licenseUrl?: string;
  carteGriseUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  rejectionReason?: string;
  submittedAt?: string;
}

export type AppViewTab = 'main' | 'profile' | 'history' | 'settings' | 'legal' | 'release_kit';

