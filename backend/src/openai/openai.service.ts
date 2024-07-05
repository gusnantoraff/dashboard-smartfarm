import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export interface Recommendations {
  ec: number | null;
  ph: number[] | null;
  humidity: number | null;
  temperature_air: number[] | null;
  temperature_water: number | null;
  water_flow: number | null;
}

@Injectable()
export class OpenAiService {
  private readonly apiKey = process.env.OPENAI_API_KEY;

  async generateRecommendations(plantName: string, typePlant: string, dap: number, location: number): Promise<Recommendations> {
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
            content: `Please provide specific and unchanging data EC per day (dS/m), pH, humidity, air temperature, water temperature, and waterflow (liter/m) for a plant with the following details:
                        \n\nPlant Name: ${plantName},
                        \nType of Plant: ${typePlant},
                        \nDAP (Days After Plant) : ${dap},
                        \nbased on Location Coordinate: ${location} and today's weather from https://weather.com/weather/today/l/${location}?par=google,
                        for IoT Hydroponics mqtt`
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
      temperature_air: null,
      temperature_water: null,
      water_flow: null,
    };
  
    const ecMatch = recommendationsText.match(/EC.*?:.*?(\d+(\.\d+)?)(\s*dS\/m)/i);
    const phMatch = recommendationsText.match(/pH.*?:.*?(\d+(\.\d+)?).*?(\d+(\.\d+)?)/i);
    const humidityMatch = recommendationsText.match(/humidity.*?:.*?(\d+(\.\d+)?%)/i);
    const airTempMatch = recommendationsText.match(/air temperature.*?:.*?(\d+(\.\d+)?(°C|degrees Celsius)).*?(\d+(\.\d+)?(°C|degrees Celsius))/i);
    const waterTempMatch = recommendationsText.match(/water temperature.*?:.*?(\d+(\.\d+)?(°C|degrees Celsius))/i);
    const waterflowMatch = recommendationsText.match(/waterflow.*?:.*?(\d+(\.\d+)?)/i);
  
    if (ecMatch) {
      recommendations.ec = parseFloat(ecMatch[1]);
    }
    if (phMatch) {
      recommendations.ph = [parseFloat(phMatch[1]), parseFloat(phMatch[3])];
    }
    if (humidityMatch) {
      recommendations.humidity = parseFloat(humidityMatch[1].replace('%', ''));
    }
    if (airTempMatch) {
      recommendations.temperature_air = [parseFloat(airTempMatch[1].replace('°C', '').replace('degrees Celsius', '')), parseFloat(airTempMatch[4].replace('°C', '').replace('degrees Celsius', ''))];
    }
    if (waterTempMatch) {
      recommendations.temperature_water = parseFloat(waterTempMatch[1].replace('°C', '').replace('degrees Celsius', ''));
    }
    if (waterflowMatch) {
      recommendations.water_flow = parseFloat(waterflowMatch[1]);
    }
  
    return recommendations as Recommendations;
  }
}