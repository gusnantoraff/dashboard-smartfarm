import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export interface Recommendations {
  ec: number | null;
  ph: number | null;
  humidity: number | null;
  air_temperature: number | null;
  water_temperature: number | null;
  waterflow: number | null;
}

@Injectable()
export class OpenAiService {
  private readonly apiKey = process.env.OPENAI_API_KEY;

  async generateRecommendations(plantName: string, typePlant: string, dap: number): Promise<Recommendations> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in plant care. Provide detailed recommendations EC, pH, humidity, air temperature, water temperature, and waterflow based on plant name, type of plant, and days after planting (DAP).',
          },
          {
            role: 'user',
            content: `Generate precise (no range) recommendations EC per day (dS/m), pH, humidity, air temperature, water temperature, and waterflow (liter/m) for a plant with the following details:\n\nPlant Name: ${plantName}\nType of Plant: ${typePlant}\nDAP: ${dap}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const recommendationsText = response.data.choices[0].message.content;
    const parsedRecommendations = this.parseRecommendations(recommendationsText);

    return parsedRecommendations;
  }

  private parseRecommendations(recommendationsText: string): Recommendations {
    const recommendations: Partial<Recommendations> = {
      ec: null,
      ph: null,
      humidity: null,
      air_temperature: null,
      water_temperature: null,
      waterflow: null,
    };

    const ecMatch = recommendationsText.match(/EC.*?:.*?(\d+(\.\d+)?)(\s*dS\/m)/i);
    const phMatch = recommendationsText.match(/pH.*?:.*?(\d+(\.\d+)?)/i);
    const humidityMatch = recommendationsText.match(/humidity.*?:.*?(\d+(\.\d+)?%)/i);
    const airTempMatch = recommendationsText.match(/air temperature.*?:.*?(\d+(\.\d+)?(°C|degrees Celsius))/i);
    const waterTempMatch = recommendationsText.match(/water temperature.*?:.*?(\d+(\.\d+)?(°C|degrees Celsius))/i);
    const waterflowMatch = recommendationsText.match(/waterflow.*?:.*?(\d+(\.\d+)?)/i);

    if (ecMatch) {
      recommendations.ec = parseFloat(ecMatch[1]);
    }
    if (phMatch) {
      recommendations.ph = parseFloat(phMatch[1]);
    }
    if (humidityMatch) {
      recommendations.humidity = parseFloat(humidityMatch[1].replace('%', ''));
    }
    if (airTempMatch) {
      recommendations.air_temperature = parseFloat(airTempMatch[1].replace('°C', '').replace('degrees Celsius', ''));
    }
    if (waterTempMatch) {
      recommendations.water_temperature = parseFloat(waterTempMatch[1].replace('°C', '').replace('degrees Celsius', ''));
    }
    if (waterflowMatch) {
      recommendations.waterflow = parseFloat(waterflowMatch[1]);
    }

    return recommendations as Recommendations;
  }
}