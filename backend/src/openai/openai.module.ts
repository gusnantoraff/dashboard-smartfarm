import { Module } from '@nestjs/common';
import { OpenAIController } from './openai.controller';
import { OpenAiService } from './openai.service';

@Module({
  controllers: [OpenAIController],
  providers: [OpenAiService]
})
export class OpenaiModule {}
