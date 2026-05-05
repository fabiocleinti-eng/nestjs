export class Contato {
  id?: number;
  userId: number; // Foreign key to User
  name: string;
  phoneNumber?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial?: Partial<Contato>) {
    Object.assign(this, partial);
  }
}
