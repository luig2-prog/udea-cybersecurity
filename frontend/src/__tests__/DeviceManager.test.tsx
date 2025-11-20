import { render, screen, waitFor } from '@testing-library/react';
import DeviceManager from '../components/DeviceManager';
import '@testing-library/jest-dom';

import * as deviceService from '../services/deviceService';
import * as userService from '../services/userService';
jest.mock('../services/deviceService', () => ({
  getAllDevices: jest.fn(() => Promise.resolve([])),
  createDevice: jest.fn((device) => Promise.resolve({ id: 'new-id', ...device })),
  updateDevice: jest.fn((id, device) => Promise.resolve({ id, ...device })),
  deleteDevice: jest.fn(() => Promise.resolve({})),
}));

jest.mock('../services/userService', () => ({
  fetchRandomUser: jest.fn(() => Promise.resolve({
    name: { first: 'John', last: 'Doe' },
    location: { city: 'Test City', country: 'Test Country' },
    login: { username: 'johndoe' },
  })),
}));

describe('DeviceManager Component', () => {
  beforeEach(() => {
    (deviceService.getAllDevices as jest.Mock).mockClear();
    (deviceService.createDevice as jest.Mock).mockClear();
    (deviceService.updateDevice as jest.Mock).mockClear();
    (deviceService.deleteDevice as jest.Mock).mockClear();
    (userService.fetchRandomUser as jest.Mock).mockClear();
    
    (userService.fetchRandomUser as jest.Mock).mockResolvedValue({
      name: { first: 'John', last: 'Doe' },
      location: { city: 'Test City', country: 'Test Country' },
      login: { username: 'johndoe' },
    });
    (deviceService.getAllDevices as jest.Mock).mockResolvedValue([]);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the main heading, add device button, and user info', async () => {
    render(<DeviceManager />);

    expect(await screen.findByRole('heading', { name: /dispositivos móviles/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /nuevo celular/i })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Test City, Test Country/i)).toBeInTheDocument();
      expect(screen.getByText(/johndoe/i)).toBeInTheDocument();
    });
  });
});