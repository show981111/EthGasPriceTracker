import { IsDate, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';
import { IsAfterStartTime } from '../../utils/isAfterStartTime.decorator';
import { IsValidUnixTimeStamp } from '../../utils/IsValidUnixTimeStamp.decorator';

export class GetAveragePriceInRangeDto {
  @IsValidUnixTimeStamp()
  @IsNotEmpty()
  fromTime: number;

  @IsValidUnixTimeStamp()
  @IsAfterStartTime('fromTime')
  @IsNotEmpty()
  toTime: number;
}
