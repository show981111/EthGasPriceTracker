import { Controller, Get, Query } from '@nestjs/common';
import { GasPrice } from 'src/entities/gasPriace.entity';
import { AverageGasPrice } from './Dto/average-gas-price.dto';
import { GasPriceSummary } from './Dto/gas-price-summary.dto';
import { GetAveragePriceInRangeDto } from './Dto/get-average-price-in-range.dto';
import { ResponseObjectDto } from './Dto/response.dto';
import { GasService } from './gas.service';

@Controller()
export class GasController {
  constructor(private readonly gasService: GasService) {}

  @Get('gas')
  async getCurrentGasPrice(): Promise<ResponseObjectDto> {
    var responseObject: ResponseObjectDto = new ResponseObjectDto();
    var res: GasPriceSummary = await this.gasService.getCurrentGasPrice();
    responseObject.message = res;
    return responseObject;
  }

  @Get('average')
  async getAverageGasPrice(
    @Query() query: GetAveragePriceInRangeDto,
  ): Promise<ResponseObjectDto> {
    var responseObject: ResponseObjectDto = new ResponseObjectDto();
    var res: AverageGasPrice = await this.gasService.getAverageFromTo(
      query.fromTime,
      query.toTime,
    );
    responseObject.message = res;
    return responseObject;
  }
}
