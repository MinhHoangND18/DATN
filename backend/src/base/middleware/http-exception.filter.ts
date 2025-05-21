import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { LoggerService } from '@base/logger';
import * as exc from '@base/api/exception.reslover';
import { config } from '@/config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = this.loggerService.getLogger('http-exception');

  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      this.handleHttpException(exception, response);
    } else if (exception instanceof Error) {
      this.handleError(exception, response);
    } else {
      this.handleUnknownException(exception, response);
    }
  }

  private handleUnknownException(exception: unknown, response: any) {
    const error = new exc.BusinessException({
      errorCode: exc.SYSTEM_ERROR,
      message: 'Có lỗi xảy ra, vui lòng thử lại sau',
    }).getResponse();

    this.loggerService.getLogger('unknown-exception').error(exception);
    response.status(500).json(error);
  }

  private handleError(error: Error, response: any) {
    const errorResponse = new exc.BusinessException({
      errorCode: exc.SYSTEM_ERROR,
      message: error.message || 'Có lỗi xảy ra, vui lòng thử lại sau',
    }).getResponse();

    this.logger.error(error);
    response.status(500).json(errorResponse);
  }

  private handleHttpException(exception: HttpException, response: any) {
    const status = exception.getStatus();
    let excResponse = exception.getResponse();

    if (this.shouldTransformResponse(excResponse)) {
      excResponse = this.transformResponse(excResponse, status);
    } else {
      excResponse['statusCode'] = status;
    }

    this.logger.error(excResponse?.['message']);
    response.status(status).json(excResponse);
  }

  private shouldTransformResponse(response: any): boolean {
    return (
      (config.FIXED_STATUS_CODE && typeof response !== 'object') ||
      !Object.getOwnPropertyDescriptor(response, 'success')
    );
  }

  private transformResponse(response: any, status: number) {
    return new exc.BadRequest({
      errorCode: exc.STATUS_CODE_MAP[status] ?? exc.UNKNOWN,
      statusCode: status,
      message: typeof response === 'object' ? response['message'] : response,
      data: typeof response === 'object' ? response['data'] : null,
    }).getResponse();
  }
}
