import { Module } from "@nestjs/common";
import { CustomServicesController } from "./custom-services.controller";
import { CustomServicesService } from "./custom-services.service";

@Module({
  controllers: [CustomServicesController],
  providers: [CustomServicesService],
  exports: [CustomServicesService],
})
export class CustomServicesModule {}

