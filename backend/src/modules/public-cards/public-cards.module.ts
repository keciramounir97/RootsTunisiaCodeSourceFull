import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/activity.module";
import { AdminPublicCardsController, PublicCardsController } from "./public-cards.controller";
import { PublicCardsService } from "./public-cards.service";

@Module({
  imports: [ActivityModule],
  controllers: [AdminPublicCardsController, PublicCardsController],
  providers: [PublicCardsService],
  exports: [PublicCardsService],
})
export class PublicCardsModule {}

