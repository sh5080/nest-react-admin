import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags("헬스 체크")
  @Get("health")
  @ApiOperation({
    summary: "서버 가동 헬스체크",
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
