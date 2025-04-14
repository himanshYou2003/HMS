// src/services/masterService.ts
import api from './api';

export interface State {
  id: number;
  state: string;
  is_enable: 'true' | 'false';
  created_on: string;
}

export interface City {
  id: number;
  state_id: number;
  city: string;
  is_enable: 'true' | 'false';
  created_on: string;
}

export const getAllStates = () => {
  return api.get<State[]>('/masters/states');
};

export const getCitiesByState = (stateId: number) => {
  return api.get<City[]>(`/masters/states/${stateId}/cities`);
};

export const addState = (state: string) => {
  return api.post<State>('/masters/states', { state });
};

export const addCity = (stateId: number, city: string) => {
  return api.post<City>(`/masters/states/${stateId}/cities`, { city });
};