import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateContatoDto } from './dto/create-contato.dto';
import { UpdateContatoDto } from './dto/update-contato.dto';
import { Contato } from './entities/contato.entity';

@Injectable()
export class ContatosService {
  private contatos: Contato[] = [];
  private contatoIdCounter = 1;

  create(userId: number, createContatoDto: CreateContatoDto) {
    // Validate that at least one contact method is provided
    if (!createContatoDto.phoneNumber && !createContatoDto.email) {
      throw new BadRequestException('At least one contact method (phone or email) is required');
    }

    const newContato: Contato = {
      id: this.contatoIdCounter++,
      userId,
      name: createContatoDto.name,
      phoneNumber: createContatoDto.phoneNumber,
      email: createContatoDto.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.contatos.push(newContato);
    return newContato;
  }

  findAll(userId: number) {
    // Users can only see their own contacts
    return this.contatos.filter(c => c.userId === userId);
  }

  findOne(id: number, userId: number) {
    const contato = this.contatos.find(c => c.id === id && c.userId === userId);
    if (!contato) {
      throw new NotFoundException('Contato not found');
    }
    return contato;
  }

  update(id: number, userId: number, updateContatoDto: UpdateContatoDto) {
    const contato = this.findOne(id, userId);

    // Validate that at least one contact method is provided after update
    const phoneNumber = updateContatoDto.phoneNumber !== undefined ? updateContatoDto.phoneNumber : contato.phoneNumber;
    const email = updateContatoDto.email !== undefined ? updateContatoDto.email : contato.email;

    if (!phoneNumber && !email) {
      throw new BadRequestException('At least one contact method (phone or email) is required');
    }

    Object.assign(contato, updateContatoDto, { updatedAt: new Date() });
    return contato;
  }

  remove(id: number, userId: number) {
    const contato = this.findOne(id, userId);
    const index = this.contatos.findIndex(c => c.id === id && c.userId === userId);
    this.contatos.splice(index, 1);
    return contato;
  }
}
