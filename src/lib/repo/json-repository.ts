import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { signOut } from '@/auth';


import { Vehicle, VehicleModel } from '@/lib/models/resource';
import {
  sortEntities,
  SortingDirection
} from '@/lib/models/helpers';
import { compare, hash } from 'bcryptjs'
import { API_URL, concatUrl, PAGE_OFFSET } from '@/lib/utils';
import { AgencyProfile, AgencyBasicInfo, AgencySocialMediaInfo, AgencyLegalDocuments } from '@/lib/models/agency';
import { User } from '@/lib/models/user';
import { cookies } from 'next/headers';

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

  async getAll(
    search = '',
    offset = 0,
    sortBy?: keyof T,
    direction?: SortingDirection
  ): Promise<{ items: T[]; newOffset: number; totalCount: number }> {
    const data = await this.fetchData();

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

// export class JsonRepository<T> {
//   private fileUrl: string;

//   constructor(fileName: string) {
//     this.fileUrl = concatUrl(`/db/${fileName}`);


//     // Create db file if not exist
//     // if (!fs.existsSync(this.filePath)) {
//     //   fs.writeFileSync(this.filePath, JSON.stringify([]));
//     // }
//   }
//   async getVehicles(
//     search = '',
//     offset = 0,
//     sortBy: keyof Vehicle,
//     direction: SortingDirection, // asc or desc
//     dateSingle: number, // Gotten from Date.getTime()
//     dateRange: { from: number; to?: number } | undefined // Same thing here Date.getTime() and exclusive to dateSingle
//   ):
//     Promise<{
//       vehicles: Vehicle[];
//       newOffset: number;
//       totalProducts: number
//     }> {
//     // Parse and clone the JSON to avoid mutating the original data
//     // const vehicles = JSON.parse(JSON.stringify(vehicleJSON)) as Vehicle[];
//     const vehicles = await this.fetchData() as Vehicle[]

//     // Step 1: Filter records based on the search query (case-insensitive)
//     const filteredVehicles = search
//       ? vehicles.filter((vehicle) =>
//         Object.values(vehicle).some((value) =>
//           value?.toString().toLowerCase().includes(search.toLowerCase())
//         )
//       )
//       : vehicles;

//     // Step 2: Filter based on dateSingle or dateRange
//     const filteredByDate = filteredVehicles;
//     // .filter((vehicle) => {
//     //   const tempStartTime =  vehicle.resource.tempOwnershipStartTime ?  || vehicle.resource.tempOwnershipStartTime?.getTime();

//     //   if (dateSingle) {
//     //     // If a single date is provided, filter based on it
//     //     return tempStartTime === dateSingle;
//     //   }

//     //   if (dateRange) {
//     //     const { from, to } = dateRange;
//     //     // If a date range is provided, filter based on the range
//     //     return (
//     //       tempStartTime !== undefined &&
//     //       tempStartTime >= from &&
//     //       (to ? tempStartTime <= to : true)
//     //     );
//     //   }

//     //   return true; // If no date filtering is needed
//     // });

//     // // Step 3: Sort vehicles if `sortBy` and `direction` are provided
//     const sortedVehicles =
//       sortBy && direction
//         ? sortVehicles(sortBy, direction, filteredByDate as Vehicle[])
//         : filteredByDate;

//     // Step 4: Paginate the records
//     const paginatedVehicles = sortedVehicles.slice(
//       offset,
//       offset + PAGE_OFFSET
//     );

//     // Step 5: Calculate the new offset
//     const newOffset = offset;

//     // Step 6: Return the processed data
//     return {
//       vehicles: paginatedVehicles,
//       newOffset,
//       totalProducts: filteredByDate.length // Total matches after filtering (not paginated)
//     };
//   }

//   async getVehicleModelById(id = ''): Promise<VehicleModel | undefined> {
//     const models = await this.fetchData() as VehicleModel[]

//     return models.find((v) => {
//       v.id === id;
//     });
//   }


//   async getVehicleModels(
//     search = '',
//     offset = 0,
//     sortBy: keyof VehicleModel,
//     direction: SortingDirection // asc or desc
//   ): Promise<{
//     models: VehicleModel[];
//     newOffset: number;
//     totalProducts: number;
//   }> {
//     // Parse and clone the JSON to avoid mutating the original data
//     const models = await this.fetchData() as VehicleModel[]
//     // Step 1: Filter records based on the search query (case-insensitive)
//     const filteredModels = search
//       ? models.filter((vehicle) =>
//         Object.values(vehicle).some((value) =>
//           value?.toString().toLowerCase().includes(search.toLowerCase())
//         )
//       )
//       : models;

//     // Step 2: Filter based on dateSingle or dateRange
//     const sortedVehicles =
//       sortBy && direction
//         ? sortVehiclesModels(
//           sortBy,
//           direction,
//           filteredModels as VehicleModel[]
//         )
//         : filteredModels;

//     // Step 4: Paginate the records
//     const paginatedVehicles = sortedVehicles.slice(
//       offset,
//       offset + PAGE_OFFSET
//     );

//     // Step 5: Calculate the new offset
//     const newOffset = offset;

//     // Step 6: Return the processed data
//     return {
//       models: paginatedVehicles,
//       newOffset,
//       totalProducts: filteredModels.length
//     };
//   }

//   // Fetch JSON data from the public directory
//   private async fetchData(): Promise<T[]> {
//     const response = await fetch(this.fileUrl);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch ${this.fileUrl}`);
//     }
//     return await response.json();
//   }

//   async createUser(
//     name: string,
//     email: string,
//     role: 'admin' | 'super-admin' | 'normal',
//     password: string,
//     sex: 'male' | 'female',
//     photoFile: File
//   ): Promise<T> {
//     const users = await this.fetchData();

//     // Check if the user already exists
//     const existingUser = users.find((user: any) => user.email === email);
//     if (existingUser) {
//       throw new Error('User already exists');
//     }

//     // Upload the photo first
//     const formData = new FormData();
//     formData.append('file', photoFile);

//     const uploadResponse = await fetch(`${API_URL}/api/upload`, {
//       method: 'POST',
//       body: formData
//     });

//     const responseBody = await uploadResponse.json();
//     if (!uploadResponse.ok) {
//       throw new Error(`Failed to upload image ${JSON.stringify(responseBody)}`);
//     }

//     const { fileUrl } = responseBody;
//     // Hash the password
//     const saltRounds = 10;
//     const passwordHash = await hash(password, saltRounds);

//     // Create the new user object
//     const newUser: User = {
//       id: crypto.randomUUID(),
//       name,
//       email,
//       passwordHash,
//       role,
//       sex,
//       photo: fileUrl // Save the stored image URL
//     };

//     // Save the new user via an API route
//     await fetch(`${API_URL}/api/users`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(newUser)
//     });

//     return newUser as T;
//   }

//   async findUserByEmail(email: string): Promise<T | undefined> {
//     const users = await this.fetchData();
//     return users.find((user: any) => user.email === email);
//   }

//   async verifyUser(email: string, password: string): Promise<T | null> {
//     const user = await this.findUserByEmail(email);

//     if (user && (await compare(password, (user as any).passwordHash))) {
//       return user;
//     }

//     return null;
//   }
//   async getAgencyById(id = ''): Promise<AgencyProfile | undefined> {
//     const profile = await this.fetchData() as AgencyProfile[]

//     return profile.find((v) => {
//       v.id === id;
//     });
//   }

// }
export class VehicleRepository extends JsonRepository<Vehicle> {
  constructor() {
    super('vehicles.json');
  }
}
export class VehicleModelRepository extends JsonRepository<VehicleModel> {
  constructor() {
    super('vehicleModels.json');
  }
}

export class UserRepository extends JsonRepository<User> {
  constructor() {
    super('users.json');
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

    console.log("Arrived here")
    // Hash password. Nb at thos point the apassword is not yet hashed
    const passwordHash = await hash(newUser.passwordHash, 10);

    // Create new user
    newUser = { ...newUser, id: crypto.randomUUID(), photo: fileUrl, passwordHash }

    // Save user via API
    await fetch(`${API_URL}/api/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) });

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
