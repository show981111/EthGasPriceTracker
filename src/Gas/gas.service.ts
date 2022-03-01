import { HttpService, Inject, Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { GasPrice } from '../entities/gasPriace.entity';
import { InsertResult } from 'typeorm';
import { GasPriceRepository } from './gas.repository';
import { AxiosResponse } from 'axios';
import { GasPriceInformation } from './Dto/gas-price-informaion.dto';
import { Cron } from '@nestjs/schedule';
import { GasPriceSummary } from './Dto/gas-price-summary.dto';
import { AverageGasPrice } from './Dto/average-gas-price.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { IngestDataLog } from './Dto/Ingest-data-log';

@Injectable()
export class GasService {
  constructor(
    private gasPriceRepository: GasPriceRepository,
    private httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  private API_URL =
    'https://ethgasstation.info/api/ethgasAPI.json?api-key=' +
    process.env.API_KEY;

  /**
   * @returns Get current gas price by calling an API then returns it
   */
  async getCurrentGasPrice(): Promise<GasPriceSummary> {
    return this.callHttpToGetCurrentGasPrice();
  }

  /**
   * @param fromTime (unixtimestamp)
   * @param toTime  (unixtimestamp)
   * @returns average gas prince fromTime to toTime
   * (average fast, low) and average, fromtTime and toTime
   */
  async getAverageFromTo(
    fromTime: number,
    toTime: number,
  ): Promise<AverageGasPrice> {
    const prices: GasPrice[] = await this.gasPriceRepository
      .createQueryBuilder()
      .select()
      .where(
        'unix_timestamp(GasPrice.createdAt) BETWEEN :fromTime AND :toTime',
        {
          fromTime,
          toTime,
        },
      )
      .getMany();
    var res: AverageGasPrice = new AverageGasPrice();
    res.fromTime = fromTime;
    res.toTime = toTime;
    for (var i = 0; i < prices.length; i++) {
      res.average += Number(prices[i].average);
      res.averageFast += Number(prices[i].fast);
      res.averageLow += Number(prices[i].low);
    }
    return res;
  }
  /**
   * @returns current gas price (fast, average, low, blockNum)
   */
  private async callHttpToGetCurrentGasPrice(): Promise<GasPriceSummary> {
    var currentPrice: GasPriceSummary = new GasPriceSummary();
    var res = this.httpService.get(this.API_URL).pipe(
      map((axiosResponse: AxiosResponse): GasPriceInformation => {
        return axiosResponse.data;
      }),
    );
    await res.forEach((entity) => {
      currentPrice.fast = entity.fastest / 10;
      currentPrice.average = entity.fast / 10;
      currentPrice.low = entity.safeLow / 10;
      currentPrice.blockNum = entity.blockNum;
    });
    return currentPrice;
  }

  /**
   * Ingesting current gasprice every 3seconds to Database
   * @returns InsertResult
   */
  //@Cron('*/3 * * * * *')
  async ingestingData(): Promise<InsertResult> {
    var currentPrice: GasPriceSummary =
      await this.callHttpToGetCurrentGasPrice();
    var gasPriceEntry: GasPrice = new GasPrice();
    gasPriceEntry.setGasPrice(
      currentPrice.fast,
      currentPrice.average,
      currentPrice.low,
      currentPrice.blockNum,
    );
    const res = await this.gasPriceRepository.insert(gasPriceEntry);
    var loggingMessage: IngestDataLog = new IngestDataLog();
    loggingMessage.location = 'GasPrice';
    loggingMessage.message = res.raw;
    loggingMessage.action = 'insert';
    this.logger.info(JSON.stringify(loggingMessage));
    return res;
  }
}
