import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";

export const CheckAccess = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    const settings = request.user.access_settings;
    const role = request.user.role;
    if(role && role === 'ADMIN') return true

    console.log(settings, 'settings')
    if (!settings || typeof settings !== 'object' || !settings.hasOwnProperty(data)) {
      // Возвращаем ошибку доступа, если нет пользователя или нет такого разрешения в токене
      throw new HttpException(`1) Access denied: ${data}`, HttpStatus.METHOD_NOT_ALLOWED);
    }

    if (!settings[data]) {
      // Возвращаем ошибку доступа, если разрешение установлено в false
      throw new HttpException(`1) Access denied: ${data}`, HttpStatus.FORBIDDEN);
    }

    return settings[data]
  }
)
