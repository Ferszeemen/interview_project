import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CostsController } from './costs.controller';
import { CostsService } from './costs.service';
import { Cost, CostsSchema } from '../schemas/costs.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cost.name, schema: CostsSchema }]),
    AuthModule,
    UsersModule
  ],
  controllers: [CostsController],
  providers: [CostsService],
})
export class CostsModule {}