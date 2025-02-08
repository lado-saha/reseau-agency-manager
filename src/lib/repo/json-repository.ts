
import { Vehicle, VehicleModel } from '@/lib/models/resource';
import {
  getNestedValue,
  sortEntities,
  SortingDirection
} from '@/lib/models/helpers';
import { compare, hash } from 'bcryptjs'
import { API_URL, concatUrl, PAGE_OFFSET } from '@/lib/utils';
import { User } from '@/lib/models/user';

const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
fuelTypes[Math.floor(Math.random() * fuelTypes.length)];

interface IRepository<T> {
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
        Object.values(item).some((value) =>
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


export class VehicleRepository extends JsonRepository<Vehicle> {
  constructor() {
    super('vehicles.json');
  }
}
export class VehicleModelRepository extends JsonRepository<VehicleModel> {
  constructor() {
    super('vehicle-models.json');
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
  // static async authenticateUser(
  //   redirect: boolean,
  //   email: string, password: string,
  // ): Promise<string | void> {
  //   try {
  //     await signIn('credentials', {
  //       redirect: redirect, // Avoid automatic redirection
  //       email: email,
  //       password: password
  //     });
  //   } catch (error) {
  //     if (error instanceof AuthError) {
  //       switch (error.type) {
  //         case 'CredentialsSignin':
  //           return 'Invalid credentials.';
  //         default:
  //           // console.log("sd" + error.cause)
  //           return error.cause?.err?.message;
  //       }
  //     }
  //     throw error;
  //   }
  // }


  // static async signOutUser() {
  //   'use server'
  //   const cookieStore = await cookies()
  //   await signOut();
  // }


  async getByIds(ids: string[]): Promise<User[]> {
    const users = await this.fetchData();
    return users.filter((u) => ids.includes(u.id))
  }


  async createUser(newUser: User): Promise<User> {
    const users = await this.fetchData();
    if (users.some(user => user.email === newUser.email)) {
      throw new Error('User already exists');
    }

    console.log("Arrived here")
    // Upload photo
    const formData = new FormData();
    formData.append('file', newUser.photo as File);
    console.log("Arrived here")
    const uploadResponse = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });

    const { fileUrl } = await uploadResponse.json();

    // Hash password. Nb at thos point the apassword is not yet hashed
    const passwordHash = await hash(newUser.passwordHash, 10);

    // Create new user
    newUser = { ...newUser, id: crypto.randomUUID(), photo: fileUrl, passwordHash }

    // Save user via API
    await fetch(`${API_URL}/api/data/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) });

    return newUser;
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
