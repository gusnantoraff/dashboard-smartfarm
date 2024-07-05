import { Time } from './TimeType';
import React from 'react';
import { Dictionary } from './DictionaryType';
import { Location } from './location.type';
import { User } from '@/hooks/useUser';

export interface DetailController extends Time {
  controller_id: string;
  name: string;
  is_active: boolean;
  template_id: string;
  template: TemplateECDap;
  cluster: Cluster;
  configs: ConfigSensor;
  controllerSessions: ControllerSession[];
}

export interface ControllerSession extends Time {
  controller_session_id: string;
  clusterId: string;
  dapFirstDateTime: string;
  dapFirstEndTime: string;
  templateId: string;
}

export interface ConfigSensor extends Time {
  config_sensor_id: string;
  controllerId: string;
  phUp: number;
  humidity: number;
  ec: number;
  phDown: number;
  waterFlow: number;
  temperatureAirMin: number;
  temperatureAirMax: number;
  peristalticPumpDuration: number;
  peristalticPumpPeriod: number;
  ecMode: string;
  controllers: DetailController;
}

export interface DetailCluster extends Time {
  cluster_id: string;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  memberships: Memberships[];
  controllers: DetailController[];
}

export interface TemplateECDap extends Time {
  template_id: string;
  configEcDap: number[];
  name: string;
  dapCount: number;
  clusterId: string;
  clusters: Cluster;
}

export type PaginationInput = {
  page: number;
  limit: number;
  search?: {
    keyword: string;
  };
  filter?: Dictionary;
};

export interface Memberships extends Time {
  membership_id: string;
  is_active: boolean;
  user_id: string;
  cluster_id: string;
  is_owner: boolean;
  is_first_owner: boolean;
  invited_by: string;
  cluster: Cluster;
  users: User;
}

export interface Cluster extends Time {
  cluster_id: string;
  name: string;
  timeZone: string;
  latitude: number;
  longitude: number;
  memberships: Memberships[];
  location?: Location;
}

export interface VoidPermission extends Time {
  void_permission_id: string;
  type: string;
  action: string;
  membershipId: string;
  requestedBy: string;
  requestedAt: string;
  requestedTo: string;
  acceptBy: string;
  acceptAt: string;
  status: string;
  memberships: Memberships;
}

export type UpdateConfigControllerMethods =
  | 'IS_ACTIVE'
  | 'PERISTALTIC'
  | 'EC'
  | 'PH'
  | 'WATER_FLOW'
  | 'HUMIDITY'
  | 'TEMPERATURE'
  | 'DAP'
  | 'FAN_HEATER';

export type MqttPayloadType = {
  action_type: string;
  temperature_air: number;
  controller_status: boolean;
  dap: number[];
  dap_date: string;
  dap_count: number;
  dap_time: string;
  date_now: string;
  ec: number;
  ec_mode: string;
  fan: boolean;
  from: string;
  heater: boolean;
  humidity: number;
  is_active: boolean;
  peristaltic_pump_duration: number;
  peristaltic_pump_period: number;
  ph: number;
  pump_1: boolean;
  pump_2: boolean;
  pump_ec_a: boolean;
  pump_ec_b: boolean;
  pump_ph_down: boolean;
  pump_ph_up: boolean;
  sf_config_ec: number[];
  sf_config_fan_air_temp_max: number;
  sf_config_fan_air_temp_min: number;
  sf_config_fan_humidity: number;
  sf_config_ph_down: number;
  sf_config_ph_up: number;
  time_now: string;
  to: string;
  temperature_water: number;
  water_flow: number;
};

export type SelectOptions = {
  value: string;
  label: string | React.ReactNode;
};
