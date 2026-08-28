import { Module } from '@nestjs/common';
import { IndividualsController } from './individuals.controller';

import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [SubscriptionsModule],
  controllers: [IndividualsController],
  providers: [],
})
export class IndividualsModule {}
