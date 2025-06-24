import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JWTUser } from "src/declaration";

function getCurrentUserByContext(context: ExecutionContext) {
  return context.switchToHttp().getRequest().user;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => 
    getCurrentUserByContext(context)
)