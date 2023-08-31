import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetRefreshToken = createParamDecorator(
  (data: string | undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest()
    return request.cookies['jwt-refresh']
  }
)
