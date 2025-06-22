import { createParamDecorator, ExecutionContext } from "@nestjs/common";

function getCurrentUserByContext(context: ExecutionContext) {
  return context.switchToHttp().getRequest().user;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => 
    getCurrentUserByContext(context)
)