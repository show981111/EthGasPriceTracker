import { IsDate, IsNumber } from 'class-validator';

export class GasPriceInformation {
  @IsNumber()
  fastest: number; //fast

  @IsNumber()
  fast: number; //average

  @IsNumber()
  safeLow: number; //low

  @IsNumber()
  blockNum: number;
}
