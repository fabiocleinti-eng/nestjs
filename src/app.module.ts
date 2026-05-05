import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContatosModule } from './contatos/contatos.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, ContatosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
