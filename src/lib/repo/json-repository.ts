
import { Vehicle, VehicleModel } from '@/lib/models/resource';
import {
  getNestedValue,
  sortEntities,
  SortingDirection
} from '@/lib/models/helpers';
import { compare, hash } from 'bcryptjs'
import { API_URL, concatUrl, PAGE_OFFSET } from '@/lib/utils';
import { User } from '@/lib/models/user';
import { NewUserFormMode } from '@/components/auth/new-user-form';

const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
fuelTypes[Math.floor(Math.random() * fuelTypes.length)];

export interface IRepository<T> {
  getAll(search?: string, offset?: number, sortBy?: keyof T, direction?: SortingDirection): Promise<{ items: T[]; newOffset: number; totalCount: number }>;
  getById(id: string): Promise<T | undefined>;
  fetchData(): Promise<T[]>;
}
export abstract class JsonRepository<T> implements IRepository<T> {
  protected fileUrl: string;

  constructor(fileName: string) {
    this.fileUrl = concatUrl(`/db/${fileName}`);
  }

  async fetchData(): Promise<T[]> {
    const response = await fetch(this.fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${this.fileUrl}`);
    }
    return await response.json();
  }

  //async getByIds(ids: string[]): Promise<T[]> {
  //  return (await this.fetchData()).filter(o => ids.includes((o as any).id))
  //}

  async getAllFiltered(
    search: string,
    offset = 0,
    searchField: keyof T | string, // Allow nested search fields
    sortBy?: keyof T | string,
    direction?: SortingDirection,

  ): Promise<{ items: T[]; newOffset: number; totalCount: number }> {
    const data = await this.fetchData();


    // Filtering
    const filteredData = search
      ? data.filter((item) => {
        let value = getNestedValue(item, searchField); // Try nested first

        if (value === undefined) {
          value = (item as any)[searchField]; // Fallback to direct field
        }

        return value?.toString().toLowerCase().includes(search.toLowerCase());
      })
      : data;

    // Sorting
    const sortedData = sortBy && direction
      ? sortEntities(sortBy, direction, filteredData)
      : filteredData;

    // Pagination
    const paginatedData = sortedData.slice(offset, offset + PAGE_OFFSET);
    return { items: paginatedData, newOffset: offset, totalCount: filteredData.length };
  }

  async getAll(
    search = '',
    offset = 0,
    sortBy?: keyof T | string,
    direction?: SortingDirection
  ): Promise<{ items: T[]; newOffset: number; totalCount: number }> {
    const data = await this.fetchData();
    console.log(data)

    // Filtering
    const filteredData = search
      ? data.filter((item) =>
        Object.values(item as any).some((value) =>
          value?.toString().toLowerCase().includes(search.toLowerCase())
        )
      )
      : data;

    // Sorting
    const sortedData =
      sortBy && direction ? sortEntities(sortBy, direction, filteredData) : filteredData;

    // Pagination
    const paginatedData = sortedData.slice(offset, offset + PAGE_OFFSET);
    return { items: paginatedData, newOffset: offset, totalCount: filteredData.length };
  }

  async getById(id: string): Promise<T | undefined> {
    const data = await this.fetchData();
    return data.find((item) => (item as any).id === id);
  }
}


export class UserRepository extends JsonRepository<User> {
  constructor() {
    super('users.json');
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const data = await this.fetchData();
    return data.find((item) => item.email === email);
  }

  async getByIds(ids: string[]): Promise<User[]> {
    const users = await this.fetchData();
    return users.filter((u) => ids.includes(u.id))
  }


  async createUser(newUser: User): Promise<User> {
    // Fetch existing users
    const users = await this.fetchData();

    // Check if a user with the same email already exists
    if (users.some(user => user.email === newUser.email)) {
      throw new Error('User with the same email already exists');
    }

    let fileUrl = '';

    // Upload photo if provided
    if (newUser.photo && typeof newUser.photo !== 'string') {
      const formData = new FormData();
      formData.append('file', newUser.photo as File);

      try {
        const uploadResponse = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload photo');
        }

        const uploadResult = await uploadResponse.json();
        fileUrl = uploadResult.fileUrl || '';
      } catch (error) {
        console.error('Error uploading photo:', error);
        throw new Error('Photo upload failed');
      }
    }

    // Hash the password
    const passwordHash = await hash(newUser.passwordHash, 10);

    // Create new user object with updated fields
    const updatedUser: User = {
      ...newUser,
      id: crypto.randomUUID(),
      photo: fileUrl || newUser.photo, // Use the uploaded photo URL or the existing one
      passwordHash,
    };

    // Save the new user via API
    try {
      const saveResponse = await fetch(`${API_URL}/api/data/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save user');
      }

      return updatedUser;
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('User creation failed');
    }
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.fetchData();
    return users.find(user => user.email === email);
  }

  async verifyUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    return user && (await compare(password, user.passwordHash)) ? user : null;
  }
}
