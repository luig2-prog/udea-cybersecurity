import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { getAllDevices, createDevice, updateDevice, deleteDevice } from '../services/deviceService';
import { fetchRandomUser } from '../services/userService';
import { Device, RandomUser } from '../types';

interface DeviceFormData {
  name: string;
  model: string;
  storage: string;
}

const DeviceManager: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<DeviceFormData>({ name: '', model: '', storage: '' });
  const [userInfo, setUserInfo] = useState<RandomUser | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [userError, setUserError] = useState<string>('');

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data: Device[] = await getAllDevices();
      setDevices(data);
    } catch (err: any) {
      setError('Failed to fetch devices.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    const loadUser = async () => {
      setUserLoading(true);
      setUserError('');
      try {
        const userData = await fetchRandomUser();
        setUserInfo(userData);
      } catch (err) {
        setUserError('Failed to fetch user information.');
        console.error(err);
      } finally {
        setUserLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModalForCreate = () => {
    setEditingDevice(null);
    setFormData({ name: '', model: '', storage: '' });
    setIsModalOpen(true);
  };

  const openModalForEdit = (device: Device) => {
    setEditingDevice(device);
    setFormData({ name: device.name, model: device.model, storage: device.storage });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDevice(null);
    setFormData({ name: '', model: '', storage: '' });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.model || !formData.storage) {
      setError('All fields are required.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      if (editingDevice) {
        await updateDevice(editingDevice.id, formData);
      } else {
        await createDevice(formData as DeviceFormData);
      }
      await fetchDevices();
      closeModal();
    } catch (err: any) {
      setError(`Failed to ${editingDevice ? 'update' : 'create'} device.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deviceId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este dispositivo?')) {
      setIsLoading(true);
      setError('');
      try {
        await deleteDevice(deviceId);
        await fetchDevices();
      } catch (err: any) {
        setError('Failed to delete device.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };


  if (isLoading && !isModalOpen && devices.length === 0 && !userLoading) {
    return <div className="p-4 text-center">Loading devices...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {userLoading && <div className="p-4 text-center text-gray-600">Loading user information...</div>}
      {userError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{userError}</div>}
      {userInfo && !userLoading && !userError && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg shadow-lg mb-6 text-white">
          <h3 className="text-xl font-semibold">User Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            <p><strong>Name:</strong> {userInfo.name.first} {userInfo.name.last}</p>
            <p><strong>Location:</strong> {userInfo.location.city}, {userInfo.location.country}</p>
            <p><strong>Username:</strong> {userInfo.login.username}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Dispositivos Móviles</h2>
        <button
          onClick={openModalForCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Nuevo Celular
        </button>
      </div>

      {error && !isModalOpen && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Almacenamiento</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {devices.map((device: Device) => (
              <tr key={device.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{device.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.model}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.storage}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => openModalForEdit(device)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                  <button onClick={() => handleDelete(device.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            ))}
            {devices.length === 0 && !isLoading && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No devices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">{editingDevice ? 'Editar Dispositivo' : 'Nuevo Dispositivo'}</h3>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
                <input type="text" name="model" id="model" value={formData.model} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="storage" className="block text-sm font-medium text-gray-700">Almacenamiento</label>
                <input type="text" name="storage" id="storage" value={formData.storage} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                  Cancelar
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
                  {isLoading ? (editingDevice ? 'Guardando...' : 'Añadiendo...') : (editingDevice ? 'Guardar Cambios' : 'Añadir Dispositivo')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManager;
