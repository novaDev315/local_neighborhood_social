'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import { petsApi } from '@/lib/api';
import Link from 'next/link';

const PET_TYPES = ['DOG', 'CAT', 'BIRD', 'FISH', 'RABBIT', 'HAMSTER', 'REPTILE', 'OTHER'];

interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  age?: number;
  description?: string;
  imageUrl?: string;
  isFriendlyWithKids: boolean;
  isFriendlyWithPets: boolean;
  createdAt: string;
  owner: { id: string; name: string };
}

interface Playdate {
  id: string;
  title: string;
  description: string;
  location: string;
  dateTime: string;
  petTypes: string[];
  maxPets: number;
  organizer: { name: string };
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [playdates, setPlaydates] = useState<Playdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'directory' | 'playdates' | 'my-pets'>('directory');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'pet' | 'playdate'>('pet');
  const [petForm, setPetForm] = useState({
    name: '',
    type: 'DOG',
    breed: '',
    age: '',
    description: '',
    isFriendlyWithKids: false,
    isFriendlyWithPets: false,
  });
  const [playdateForm, setPlaydateForm] = useState({
    title: '',
    description: '',
    location: '',
    dateTime: '',
    petTypes: ['DOG'],
    maxPets: 10,
  });

  useEffect(() => {
    if (activeTab === 'directory') {
      loadPets();
    } else if (activeTab === 'playdates') {
      loadPlaydates();
    } else if (activeTab === 'my-pets') {
      loadMyPets();
    }
  }, [filter, activeTab]);

  const loadPets = async () => {
    try {
      const params = filter ? { type: filter } : {};
      const response = await petsApi.getAll(params);
      setPets(response.data);
    } catch (error) {
      console.error('Failed to load pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlaydates = async () => {
    try {
      const params = filter ? { petType: filter } : {};
      const response = await petsApi.getPlaydates(params);
      setPlaydates(response.data);
    } catch (error) {
      console.error('Failed to load playdates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyPets = async () => {
    try {
      const response = await petsApi.getMyPets();
      setPets(response.data);
    } catch (error) {
      console.error('Failed to load my pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await petsApi.create({
        ...petForm,
        age: petForm.age ? parseInt(petForm.age) : null,
      });
      setShowForm(false);
      setPetForm({
        name: '',
        type: 'DOG',
        breed: '',
        age: '',
        description: '',
        isFriendlyWithKids: false,
        isFriendlyWithPets: false,
      });
      loadPets();
    } catch (error) {
      console.error('Failed to create pet:', error);
    }
  };

  const handlePlaydateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await petsApi.createPlaydate(playdateForm);
      setShowForm(false);
      setPlaydateForm({
        title: '',
        description: '',
        location: '',
        dateTime: '',
        petTypes: ['DOG'],
        maxPets: 10,
      });
      loadPlaydates();
    } catch (error) {
      console.error('Failed to create playdate:', error);
    }
  };

  const getTypeEmoji = (type: string) => {
    const emojis: { [key: string]: string } = {
      DOG: '🐕', CAT: '🐱', BIRD: '🐦', FISH: '🐟', RABBIT: '🐰', HAMSTER: '🐹', REPTILE: '🦎', OTHER: '🐾'
    };
    return emojis[type] || '🐾';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pet Directory</h1>
              <div className="flex space-x-4">
                <Button onClick={() => { setShowForm(!showForm); setFormType('pet'); }}>
                  {showForm && formType === 'pet' ? 'Cancel' : 'Add Pet'}
                </Button>
                <Button variant="outline" onClick={() => { setShowForm(!showForm); setFormType('playdate'); }}>
                  {showForm && formType === 'playdate' ? 'Cancel' : 'Create Playdate'}
                </Button>
                <Link href="/dashboard">
                  <Button variant="ghost">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('directory')}
              className={`pb-2 px-1 ${activeTab === 'directory' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              Pet Directory
            </button>
            <button
              onClick={() => setActiveTab('playdates')}
              className={`pb-2 px-1 ${activeTab === 'playdates' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              Playdates
            </button>
            <button
              onClick={() => setActiveTab('my-pets')}
              className={`pb-2 px-1 ${activeTab === 'my-pets' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              My Pets
            </button>
          </div>

          {/* Pet Type Filter */}
          {(activeTab === 'directory' || activeTab === 'playdates') && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={filter === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('')}
              >
                All
              </Button>
              {PET_TYPES.map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(type)}
                >
                  {getTypeEmoji(type)} {type.charAt(0) + type.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          )}

          {/* Pet Form */}
          {showForm && formType === 'pet' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add Your Pet</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePetSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Pet Name"
                      value={petForm.name}
                      onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                      <select
                        value={petForm.type}
                        onChange={(e) => setPetForm({ ...petForm, type: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                      >
                        {PET_TYPES.map((type) => (
                          <option key={type} value={type}>{getTypeEmoji(type)} {type.charAt(0) + type.slice(1).toLowerCase()}</option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Breed"
                      value={petForm.breed}
                      onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                    />
                    <Input
                      label="Age (years)"
                      type="number"
                      value={petForm.age}
                      onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
                    />
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={petForm.isFriendlyWithKids}
                          onChange={(e) => setPetForm({ ...petForm, isFriendlyWithKids: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Kid-friendly</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={petForm.isFriendlyWithPets}
                          onChange={(e) => setPetForm({ ...petForm, isFriendlyWithPets: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Pet-friendly</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      value={petForm.description}
                      onChange={(e) => setPetForm({ ...petForm, description: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                      rows={3}
                    />
                  </div>
                  <Button type="submit">Add Pet</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Playdate Form */}
          {showForm && formType === 'playdate' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create a Playdate</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePlaydateSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Title"
                      value={playdateForm.title}
                      onChange={(e) => setPlaydateForm({ ...playdateForm, title: e.target.value })}
                      required
                    />
                    <Input
                      label="Location"
                      value={playdateForm.location}
                      onChange={(e) => setPlaydateForm({ ...playdateForm, location: e.target.value })}
                      required
                    />
                    <Input
                      label="Date & Time"
                      type="datetime-local"
                      value={playdateForm.dateTime}
                      onChange={(e) => setPlaydateForm({ ...playdateForm, dateTime: e.target.value })}
                      required
                    />
                    <Input
                      label="Max Pets"
                      type="number"
                      value={playdateForm.maxPets}
                      onChange={(e) => setPlaydateForm({ ...playdateForm, maxPets: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      value={playdateForm.description}
                      onChange={(e) => setPlaydateForm({ ...playdateForm, description: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                      rows={3}
                    />
                  </div>
                  <Button type="submit">Create Playdate</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              {(activeTab === 'directory' || activeTab === 'my-pets') && (
                pets.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-gray-500">{activeTab === 'my-pets' ? "You haven't added any pets yet" : 'No pets found'}</p>
                      {activeTab === 'my-pets' && (
                        <Button className="mt-4" onClick={() => { setShowForm(true); setFormType('pet'); }}>Add Your Pet</Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map((pet) => (
                      <Card key={pet.id}>
                        {pet.imageUrl && (
                          <img src={pet.imageUrl} alt={pet.name} className="w-full h-48 object-cover rounded-t-lg" />
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{getTypeEmoji(pet.type)}</span>
                            <div className="flex space-x-1">
                              {pet.isFriendlyWithKids && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Kid-friendly</span>}
                              {pet.isFriendlyWithPets && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Pet-friendly</span>}
                            </div>
                          </div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{pet.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {pet.breed || pet.type.charAt(0) + pet.type.slice(1).toLowerCase()}
                            {pet.age && ` · ${pet.age} ${pet.age === 1 ? 'year' : 'years'} old`}
                          </p>
                          {pet.description && (
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{pet.description}</p>
                          )}
                          <p className="mt-3 text-xs text-gray-400">Owner: {pet.owner?.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'playdates' && (
                playdates.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-gray-500">No upcoming playdates</p>
                      <Button className="mt-4" onClick={() => { setShowForm(true); setFormType('playdate'); }}>Create a Playdate</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {playdates.map((playdate) => (
                      <Card key={playdate.id}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{playdate.title}</h3>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>📍 {playdate.location}</p>
                            <p>📅 {new Date(playdate.dateTime).toLocaleString()}</p>
                            <p>🐾 Max {playdate.maxPets} pets</p>
                          </div>
                          {playdate.description && (
                            <p className="text-sm text-gray-500 mt-2">{playdate.description}</p>
                          )}
                          <p className="mt-3 text-xs text-gray-400">Organized by: {playdate.organizer?.name}</p>
                          <Button className="mt-3 w-full" size="sm">Join Playdate</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
