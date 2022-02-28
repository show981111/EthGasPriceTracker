import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GasController } from './gas.controller';
import { GasPriceRepository } from './gas.repository';
import { GasService } from './gas.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([GasPriceRepository])],
  providers: [GasService],
  controllers: [GasController],
})
export class GasModule {}
