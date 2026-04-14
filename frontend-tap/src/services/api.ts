import axios from 'axios';
import type { Airline, AirlineFormData, Airplane, AirplaneFormData } from '../types';

// En desarrollo usa el proxy de Vite (/api), en producción usa la URL del backend
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://gestiondeavionesapi-grcwcze3ema9bpfc.canadacentral-01.azurewebsites.net/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== Airlines API ====================

// Get all airlines
export const getAirlines = async (): Promise<Airline[]> => {
  const response = await api.get<Airline[]>('/Airlines');
  return response.data;
};

// Get airline by ID
export const getAirlineById = async (id: number): Promise<Airline> => {
  const response = await api.get<Airline>(`/Airlines/${id}`);
  return response.data;
};

// Create new airline
export const createAirline = async (data: AirlineFormData): Promise<Airline> => {
  const response = await api.post<Airline>('/Airlines', data);
  return response.data;
};

// Update airline
export const updateAirline = async (id: number, data: AirlineFormData): Promise<Airline> => {
  const response = await api.put<Airline>(`/Airlines/${id}`, { id, ...data });
  return response.data;
};

// Search airlines by name or phone
export const searchAirlines = async (name?: string, phone?: string): Promise<Airline[]> => {
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  if (phone) params.append('phone', phone);
  const response = await api.get<Airline[]>(`/Airlines/search?${params.toString()}`);
  return response.data;
};

// ==================== Airplanes API ====================

// Get all airplanes
export const getAirplanes = async (): Promise<Airplane[]> => {
  const response = await api.get<Airplane[]>('/Airplanes');
  return response.data;
};

// Get airplane by ID
export const getAirplaneById = async (id: number): Promise<Airplane> => {
  const response = await api.get<Airplane>(`/Airplanes/${id}`);
  return response.data;
};

// Get airplanes by airline ID
export const getAirplanesByAirline = async (airlineId: number): Promise<Airplane[]> => {
  const response = await api.get<Airplane[]>(`/Airplanes/by-airline/${airlineId}`);
  return response.data;
};

// Create new airplane
export const createAirplane = async (data: AirplaneFormData): Promise<Airplane> => {
  const response = await api.post<Airplane>('/Airplanes', data);
  return response.data;
};

// Update airplane
export const updateAirplane = async (id: number, data: AirplaneFormData): Promise<Airplane> => {
  const response = await api.put<Airplane>(`/Airplanes/${id}`, { id, ...data });
  return response.data;
};

export default api;
