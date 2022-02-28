import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .setLogger(new Logger())
      .compile();

    connection = moduleFixture.get(Connection);
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true, // param 에 적은 타입으로 변환해줌.
      }),
    );
    await app.init();
  });

  it('should get valid current gas price', async () => {
    return await request(app.getHttpServer()).get('/gas').expect(200);
  });

  it('should get Average gas price', async () => {
    return await request(app.getHttpServer())
      .get('/average?fromTime=1646023206&toTime=1646023210')
      .expect(200);
  });

  it('should fail because of from > to', async () => {
    return await request(app.getHttpServer())
      .get('/average?fromTime=1646023206&toTime=1646023201')
      .expect(400);
  });

  it('should fail because of invalid timestamp', async () => {
    return await request(app.getHttpServer())
      .get('/average?fromTime=1646023206&toTime=432')
      .expect(400);
  });

  it('should fail because given time is the future', async () => {
    let future = new Date().getTime() / 1000 + 100;
    return await request(app.getHttpServer())
      .get('/average?fromTime=1646023206&toTime=' + future)
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
