export interface INeighborhood {
  id: string;
  name: string;
  description?: string;
  boundary: IGeoBoundary;
  centerPoint: {
    latitude: number;
    longitude: number;
  };
  city: string;
  state: string;
  zipCodes: string[];
  memberCount: number;
  radius?: number; // in meters
  settings: INeighborhoodSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGeoBoundary {
  type: 'Polygon';
  coordinates: number[][][]; // GeoJSON format
}

export interface INeighborhoodSettings {
  requireAddressVerification: boolean;
  allowPublicPosts: boolean;
  moderationEnabled: boolean;
  autoJoinEnabled: boolean;
}

export interface ICreateNeighborhoodDto {
  name: string;
  description?: string;
  centerPoint: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  city: string;
  state: string;
  zipCodes: string[];
}

export interface IUpdateNeighborhoodDto {
  name?: string;
  description?: string;
  settings?: Partial<INeighborhoodSettings>;
}
