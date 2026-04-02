// Type Definitions
export type RoleType = 'admin' | 'customer';

export type User = {
  id: string;
  email: string;
  role: RoleType;
  name: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  iconName: string; // matches lucide-react-native icons
  description: string;
};

export type Business = {
  id: string;
  serviceId: string;
  name: string;
  rating: number;
  location: string;
  description: string;
  priceRange: string;
  imageUrl?: string;
};

export type OrderStatus = 'SUBMITTED' | 'AWAITING_PAYMENT' | 'PAID' | 'CASH_PENDING' | 'CANCELLED';

export interface Order {
  id: string;
  businessId: string;
  customerId: string;
  date: string;
  time: string;
  status: OrderStatus;
  serviceId: string;
  payment_method?: 'CARD' | 'CASH';
  notes?: string;
};

export interface LocationData {
  id: string;
  wilaya_name: string;
  daira_name: string;
}

// Hardcoded users for testing
export const MOCK_USERS: User[] = [
  { id: 'u1', email: 'admin@test.com', role: 'admin', name: 'Admin Tester' },
  { id: 'u2', email: 'user@test.com', role: 'customer', name: 'Customer Tester' }
];

export const MOCK_SERVICES: ServiceCategory[] = [
  { id: 's1', name: 'Medical', iconName: 'Stethoscope', description: 'Doctors, Clinics, and Healthcare' },
  { id: 's2', name: 'Salon', iconName: 'Scissors', description: 'Hair, Nails, and Beauty salons' },
  { id: 's3', name: 'Auto', iconName: 'Car', description: 'Mechanics, Washes, and Repairs' },
  { id: 's4', name: 'Legal', iconName: 'Scale', description: 'Lawyers, Notaries, and Consultants' },
  { id: 's5', name: 'Home Repair', iconName: 'Hammer', description: 'Plumbers, Electricians, Handymen' },
  { id: 's6', name: 'Fitness', iconName: 'Dumbbell', description: 'Gyms, Trainers, and Yoga studios' },
  { id: 's7', name: 'Pets', iconName: 'Dog', description: 'Vets, Grooming, and Walkers' },
  { id: 's8', name: 'Cleaning', iconName: 'Sparkles', description: 'House cleaning and Janitorial' },
];

export const MOCK_BUSINESSES: Business[] = [
  // Medical
  { id: 'b1', serviceId: 's1', name: 'City Hospital Clinic', rating: 4.8, location: 'Downtown', description: 'General checkups and specialist consults.', priceRange: '$$' },
  { id: 'b2', serviceId: 's1', name: 'Green Valley Dental', rating: 4.9, location: 'West End', description: 'Complete dental care for the family.', priceRange: '$$$' },
  
  // Salon
  { id: 'b3', serviceId: 's2', name: 'Luxe Hair Studio', rating: 4.7, location: 'North Avenue', description: 'Premium hair styling and coloring.', priceRange: '$$$' },
  { id: 'b4', serviceId: 's2', name: 'Nail Artistry', rating: 4.5, location: 'Mall Center', description: 'Manicures and pedicures.', priceRange: '$' },
  
  // Auto
  { id: 'b5', serviceId: 's3', name: 'Fast Lane Mechanics', rating: 4.6, location: 'South Industrial', description: 'Quick repairs and oil changes.', priceRange: '$$' },
  { id: 'b6', serviceId: 's3', name: 'Sparkle Auto Wash', rating: 4.8, location: 'Main Street', description: 'Full service car detailing.', priceRange: '$$' },
  
  // Legal
  { id: 'b7', serviceId: 's4', name: 'Smith & Co Law', rating: 4.9, location: 'Business District', description: 'Corporate and civil law.', priceRange: '$$$$' },
  { id: 'b8', serviceId: 's4', name: 'Neighborhood Notary', rating: 4.5, location: 'East Side', description: 'Quick document notarization.', priceRange: '$' },
  
  // Home Repair
  { id: 'b9', serviceId: 's5', name: 'Pro Plumbers App', rating: 4.7, location: 'Mobile Service', description: '24/7 plumbing emergency response.', priceRange: '$$$' },
  { id: 'b10', serviceId: 's5', name: 'Bright Sparks Electric', rating: 4.8, location: 'Mobile Service', description: 'Electrical installations and repair.', priceRange: '$$' },
  
  // Fitness
  { id: 'b11', serviceId: 's6', name: 'Iron Core Gym', rating: 4.6, location: 'Uptown', description: 'Weights, classes, and private trainers.', priceRange: '$$' },
  { id: 'b12', serviceId: 's6', name: 'Zen Flow Yoga', rating: 4.9, location: 'Riverfront', description: 'Mindfulness and relaxation.', priceRange: '$$' },
  
  // Pets
  { id: 'b13', serviceId: 's7', name: 'Happy Paws Vet', rating: 4.8, location: 'Suburbs', description: 'Caring vets for your furry friends.', priceRange: '$$$' },
  { id: 'b14', serviceId: 's7', name: 'Bark Avenue Grooming', rating: 4.6, location: 'Downtown', description: 'Premium pet styling.', priceRange: '$$' },
  
  // Cleaning
  { id: 'b15', serviceId: 's8', name: 'Spotless Maids', rating: 4.7, location: 'Mobile Service', description: 'Weekly and deep cleaning services.', priceRange: '$$' },
  { id: 'b16', serviceId: 's8', name: 'Fresh Start Janitorial', rating: 4.5, location: 'Commercial Park', description: 'Office and commercial cleaning.', priceRange: '$$$' },
];

export const INITIAL_ORDERS: Order[] = [
  { id: 'o1', businessId: 'b1', customerId: 'u2', date: '2026-04-10', time: '10:00', status: 'SUBMITTED', serviceId: 's1', notes: 'First checkup' },
  { id: 'o2', businessId: 'b3', customerId: 'u2', date: '2026-04-12', time: '14:30', status: 'CONFIRMED', serviceId: 's2' },
  { id: 'o3', businessId: 'b5', customerId: 'u2', date: '2026-04-05', time: '09:00', status: 'CANCELLED', serviceId: 's3' },
  { id: 'o4', businessId: 'b12', customerId: 'u2', date: '2026-04-15', time: '18:00', status: 'PAID', serviceId: 's6', notes: 'Monthly pass' },
];
