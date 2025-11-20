import { Device } from '../types';

let devices: Device[] = [
  {
    id: '1',
    name: 'iPhone 13',
    model: 'A2482',
    storage: '128GB'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S21',
    model: 'SM-G991U',
    storage: '256GB'
  }
];

export const getAllDevices = async (): Promise<Device[]> => {
  return Promise.resolve(devices);
};

export const getDeviceById = async (id: string): Promise<Device | undefined> => {
  const device = devices.find(d => d.id === id);
  return Promise.resolve(device);
};

export const createDevice = async (device: Omit<Device, 'id'>): Promise<Device> => {
  const newDevice: Device = {
    ...device,
    id: Date.now().toString()
  };
  
  devices.push(newDevice);
  return Promise.resolve(newDevice);
};

export const updateDevice = async (id: string, updatedDevice: Partial<Omit<Device, 'id'>>): Promise<Device | null> => {
  const deviceIndex = devices.findIndex(d => d.id === id);
  
  if (deviceIndex === -1) {
    return Promise.resolve(null);
  }
  
  devices[deviceIndex] = {
    ...devices[deviceIndex],
    ...updatedDevice
  };
  
  return Promise.resolve(devices[deviceIndex]);
};

export const deleteDevice = async (id: string): Promise<boolean> => {
  const initialLength = devices.length;
  devices = devices.filter(d => d.id !== id);
  return Promise.resolve(devices.length !== initialLength);
};
