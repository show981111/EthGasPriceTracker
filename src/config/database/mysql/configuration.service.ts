import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class MysqlConfigService {
  constructor(private configService: ConfigService) {}

  public get host(): string {
    return this.configService.get<string>('mysql.host');
  }
  public get port(): number {
    return Number(this.configService.get<number>('mysql.port'));
  }
  get username(): string {
    return this.configService.get<string>('mysql.username');
  }
  get password(): string {
    return this.configService.get<string>('mysql.password');
  }
  get database(): string {
    return this.configService.get<string>('mysql.database');
  }
}
