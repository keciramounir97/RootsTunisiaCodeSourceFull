import { Module } from '@nestjs/common';
import { IndividualsController } from './individuals.controller';

@Module({
  controllers: [IndividualsController],
  providers: [],
})
export class IndividualsModule {}
