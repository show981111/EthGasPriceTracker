import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let message = (exception as any)?.response?.message;
    let error = (exception as any)?.response?.error;

    if (!message) message = exception?.toString();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (request?.body?.userPassword) request.body.userPassword = undefined;
    if (request?.body?.refreshToken) request.body.refreshToken = undefined;

    var loggingMessage = `${status} | [${request.method}] ${
      request.originalUrl
    } [Body] ${JSON.stringify(request.body)} [Params] ${JSON.stringify(
      request.params,
    )} [Query] ${JSON.stringify(
      request.query,
    )} [Message] ${message} [Error] ${error} [FROM] ${request.user?.userID}`;

    this.logger.error(loggingMessage);

    response.status(status).json({
      error: 'true',
      timestamp: new Date().toISOString(),
      statusCode: status,
      statusMessage: error,
      message: message,
      path: request.url,
    });
  }
}
