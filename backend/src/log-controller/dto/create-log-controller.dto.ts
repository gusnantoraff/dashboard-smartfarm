import { ConfigEcDap } from '../../config-ec-dap/entities/config-ec-dap.entity';
import { ConfigSensor } from '../../config-sensor/entities/config-sensor.entity';
import { Controller } from '../../controller/entities/controller.entity';

export class CreateLogControllerDto {
  controllers: Controller;
  configEcDaps: ConfigEcDap;
  configSensors: ConfigSensor;
  dap_first_time: Date;
  temperature_water: number;
  humidity: number;
  ec: number;
  ph: number;
  water_flow: number;
  temperature_air: number;
  dap_num: number;
}
