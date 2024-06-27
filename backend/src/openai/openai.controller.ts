import { Controller, Post, Body } from '@nestjs/common';
import { OpenAiService } from './openai.service';


@Controller('generate-ai')
export class OpenAIController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post()
  async generate(@Body() body: { plantName: string; typePlant: string; dap: number, location: number }) {
    const { plantName, typePlant, dap, location } = body;
    const recommendations = await this.openAiService.generateRecommendations(plantName, typePlant, dap, location);
    return { recommendations };
  }
}
