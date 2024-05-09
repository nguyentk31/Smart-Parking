export interface Location {
  id: string;
  name: string;
  image: string;
}

export interface ImageLocation {
  id: string;
  url: string;
  description: string;
}

export interface Area {
  id: string;
  name: string;
  slot: number;
  floors: number;
  price: number;
}

export interface Slot {
  id: string;
  name: string;
  area: Area;
  status: "available" | "unavailable";
}

export interface Parking {
  id: string;
  plate: string;
  imageIn: string;
  imageOut: string | null;
  checkIn: string;
  checkOut: string | null;
  // slot: string | null;
  // area: string | null;
  totalPayment: number;
  status: "parking" | "completed" | "pending";
}
