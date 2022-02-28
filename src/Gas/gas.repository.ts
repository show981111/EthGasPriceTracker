import { GasPrice } from '../entities/gasPriace.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(GasPrice)
export class GasPriceRepository extends Repository<GasPrice> {}
