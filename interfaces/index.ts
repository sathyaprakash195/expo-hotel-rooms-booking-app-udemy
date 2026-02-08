export interface IUser {
  id: string;
  name: string;
  password: string;
  email: string;
  role: string;
  is_active: boolean;
  profile_picture: string;
  created_at: string;
}

// Hotel interface
export interface IHotel {
  id: number;
  created_at: string; // ISO date string
  name?: string;
  description?: string;
  city?: string;
  address?: string;
  email?: string;
  phone?: string;
  images?: string[];
  status?: string;
  owner_id?: number;
  amenities?: string[];
  starting_rent?: number;
}

// Room interface
export interface IRoom {
  id: number;
  created_at: string; // ISO date string
  hotel_id?: number;
  owner_id?: number;
  name?: string;
  description?: string;
  type?: string;
  rent_per_day?: number;
  status?: string;
  amenities?: string[];
  images: string[];
}

export interface IBooking {
  id: number;
  created_at: string; // ISO date string
  customer_id?: number;
  hotel_id?: number;
  room_id?: number;
  booked_dates?: string[]; // Array of ISO date strings
  check_in_date?: string; // ISO date string
  check_out_date?: string; // ISO date string
  total_amount?: number;
  payment_id?: string;
  status?: string;

  // Optional related data
  room?: IRoom;
  hotel?: IHotel;
}
