// Airline type based on API schema
export interface Airline {
  id: number;
  name: string | null;
  phone: string | null;
}

// Airplane type based on API schema
export interface Airplane {
  id: number;
  model: string | null;
  airlineId: number;
}

// Extended airplane type with airline info for display
export interface AirplaneWithAirline extends Airplane {
  airlineName?: string;
}

// Form data types (without id for creation)
export interface AirlineFormData {
  name: string;
  phone: string;
}

export interface AirplaneFormData {
  model: string;
  airlineId: number;
}
