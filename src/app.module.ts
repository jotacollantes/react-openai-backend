import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GptModule } from './gpt/gpt.module';

@Module({
  //Para poder usar las variables de entorno especificamos [ConfigModule.forRoot().
  imports: [ConfigModule.forRoot(), GptModule],
})
export class AppModule {}
