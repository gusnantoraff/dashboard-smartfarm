import React, { useEffect, useState } from 'react';
import useMqtt from '@/hooks/useMqtt';
import dayjs from 'dayjs';
import {
  Text
} from '@chakra-ui/react';
import { SpinnerIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import DashboardLayout from '@/layouts/Dashboard.layout';
import CardStatistic from '@/components/CardStatistic';
import DetailItem from '@/components/Detailitem';
import SkeletonComponent from '@/components/Skeleton';
import Status from '@/components/Status';
import EcConfigModal from '@/components/EcConfigModal';
import { DetailController, MqttPayloadType } from '@/types';
import Cookies from 'js-cookie';

export async function getServerSideProps(context: any) {
  const { id } = context.query;

  const res = await fetch(`http://localhost:4000/controllers/${id}`);
  const data = await res.json();

  return {
    props: {
      id,
      data,
    },
  };
}

type Props = {
  id: string;
  data: any;
};

export default function Detail({ data }: Props) {
  const { mqtt, status } = useMqtt();
  const [payload, setPayload] = useState<MqttPayloadType>();

  useEffect(() => {
    if (mqtt && data) {
      mqtt.on('message', (_, message) => {
        const mqttPayload: MqttPayloadType = JSON.parse(message.toString());
        const isControllerNameAlreadySetup =
          controller.name.split('/').length > 1;

        let controllerId = controller.name;

        if (!isControllerNameAlreadySetup) {
          controllerId = `${controller.cluster.cluster_id}/${controller.name}`;
        }

        if (
          mqttPayload.from === controllerId &&
          mqttPayload.action_type === 'log_controller'
        ) {
          const expirationTime = new Date(new Date().getTime() + 30 * 60 * 1000);
          Cookies.set(`mqttPayload_${controller.name}`, JSON.stringify(mqttPayload), { expires: expirationTime, path: '/' });
          setPayload(mqttPayload);
        }
      });
    }
  }, [mqtt, data]);

  useEffect(() => {
    const cookiePayload = Cookies.get(`mqttPayload_${controller.name}`);
    if (cookiePayload) {
      setPayload(JSON.parse(cookiePayload));
    }
  }, []);


  console.log('data', data);
  console.log('payload', payload);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'status.success';
      case 'offline':
        return 'status.error';
      default:
        return 'status.warning';
    }
  };

  if (!data) {
    return (
      <DashboardLayout overrideTitle={'Memuat Controller...'}>
        <SkeletonComponent />
      </DashboardLayout>
    );
  }

  const controller = data as DetailController;

  return (
    <DashboardLayout
      overrideTitle={controller.name.split('/')?.[1] ?? controller.name}
    >
      <div className='bg-white flex justify-between items-end rounded-lg p-6 mb-4'>
        {/*** CONTROLLER NAME ***/}
        <DetailItem.Title
          noMargin
          title={controller.name.split('/')?.[1] ?? controller.name}
          subtitle={
            <div className='flex gap-2'>
              <span>Sensor Status:</span>
              <div className='flex gap-1 items-center'>
                <span className={`${payload?.controller_status ? 'text-[#19D076]' : 'text-[#E5363D]'}`}>
                  {payload?.controller_status ? 'Active' : 'Inactive'}
                </span>
                <Status
                  color={payload?.controller_status ? 'status.success' : 'status.error'}
                />
              </div>
            </div>
          }
          subtitle2={
            <Link
              target='_blank'
              className='hover:border-b hover:border-b-[#014493] border-dashed transition-all duration-200
               border border-transparent'
              href={`/cluster/${controller.cluster.cluster_id}`}
            >
              {`Cluster: ${controller.cluster.name}`}
            </Link>
          }
          status={payload?.is_active ? true : false}
        />
        {/*** CONTROLLER NAME ***/}

        <div className='flex gap-2 items-center'>
          <Text fontSize={'14px'} color={'black'} fontWeight={500}>
            Connection Status:{' '}
            <Text as='span' color={getStatusColor(status)}>
              {status}
            </Text>
          </Text>
          {status === 'connecting' ? (
            <SpinnerIcon color='status.warning' className='animate-spin' />
          ) : (
            <Status color={getStatusColor(status)} />
          )}
        </div>
      </div>

      <div className='flex flex-col gap-5 pb-8'>
        <div className='w-full flex gap-5'>
          <CardStatistic
            className='w-full md:w-[25%]'
            helperText='Setting Temperatur'
            label='Temperature'
            method='TEMPERATURE'
            schema={{
              controllerId: controller.controller_id,
              airTemperatureMin: payload?.sf_config_fan_air_temp_min ?? 0,
              airTemperatureMax: payload?.sf_config_fan_air_temp_max ?? 0,
            }}
          >
            <div className='flex flex-col gap-5'>
              <CardStatistic.SubItem
                label={`Air (${payload?.sf_config_fan_air_temp_min ?? 0} - ${payload?.sf_config_fan_air_temp_max ?? 0})`}
                value={
                  <span>
                    {payload?.temperature_air ?? 0} <sup>o</sup>C
                  </span>
                }
              />
              <CardStatistic.SubItem
                label={`Water`}
                value={
                  <span>
                    {payload?.temperature_water ?? 0} <sup>o</sup>C
                  </span>
                }
              />
            </div>
          </CardStatistic>
          <CardStatistic
            method='DAP'
            schema={{
              controllerId: controller.controller_id,
              dap_count: dayjs().format('DD MMMM YYYY'),
            }}
            bodyClassName='flex items-center'
            className='w-full flex justify-center md:w-[75%]'
          >
            <div className='flex gap-24 items-center'>
              <CardStatistic.SubItem
                bold
                label={`Date Time`}
                value={payload?.date_now ?? dayjs().format('DD MMM YYYY')}
                sub={payload?.time_now}
              />
              <CardStatistic.SubItem
                bold
                label={`DAP`}
                value={`${payload?.dap_count ?? 0} Days`}
                sub={payload?.dap_time}
              />
            </div>
          </CardStatistic>
        </div>
        <div className='w-full flex gap-5'>
          <div className='flex flex-col w-full md:w-[25%] gap-5'>
            <CardStatistic
              label={`Humidity (${payload?.sf_config_fan_humidity ?? 0})`}
              value={`${payload?.humidity ?? 0}%`}
              helperText={'Setting Humidity'}
              method='HUMIDITY'
              schema={{
                controllerId: controller.controller_id,
                humidity: payload?.sf_config_fan_humidity ?? 0,
              }}
            />
            <CardStatistic
              method='FAN_HEATER'
              schema={{
                controllerId: controller.controller_id,
                fan: false,
                heater: false,
              }}
              bodyClassName='flex justify-center items-center'
              className='flex-1'
            >
              <div className='flex gap-x-24'>
                <CardStatistic.SubItem
                  small
                  label={`Fan`}
                  value={payload?.fan ? 'On' : 'Off'}
                />
                <CardStatistic.SubItem
                  small
                  label={`Heater`}
                  value={payload?.heater ? 'On' : 'Off'}
                />
              </div>
            </CardStatistic>
          </div>
          <div className='grid grid-cols-3 w-full md:w-[75%] gap-5'>
            <EcConfigModal
              schema={{
                controllerId: controller.controller_id,
              }}
              method='EC'
              label={`EC (${payload?.sf_config_ec?.[payload?.dap_count - 1] ?? 0})`}
              value={`${payload?.ec ?? 0}`}
              helperText={'Setting EC'}
              ecDaps={payload?.dap ?? []}
              ecMode={payload?.ec_mode ?? 'single'}
            >
              <div className='flex flex-col gap-5'>
                <CardStatistic.SubItem
                  label={`A Nutrition`}
                  value={payload?.pump_ec_a ? 'On' : 'Off'}
                  small
                />
                <CardStatistic.SubItem
                  label={`B Nutrition`}
                  value={payload?.pump_ec_b ? 'On' : 'Off'}
                  small
                />
              </div>
            </EcConfigModal>
            <CardStatistic
              method='PH'
              schema={{
                controllerId: controller.controller_id,
                phDown: payload?.sf_config_ph_down ?? 0,
                phUp: payload?.sf_config_ph_up ?? 0,
              }}
              label={`pH (${payload?.sf_config_ph_down ?? 0} - ${payload?.sf_config_ph_up ?? 0})`}
              value={`${payload?.ph ?? 0}`}
              helperText={'Setting pH'}
            >
              <div className='flex flex-col gap-5'>
                <CardStatistic.SubItem
                  label={`pH Up`}
                  value={payload?.pump_ph_up ? 'On' : 'Off'}
                  small
                />
                <CardStatistic.SubItem
                  label={`pH Down`}
                  value={payload?.pump_ph_down ? 'On' : 'Off'}
                  small
                />
              </div>
            </CardStatistic>
            <CardStatistic
              method='WATER_FLOW'
              schema={{
                controllerId: controller.controller_id,
                doseInterval: payload?.peristaltic_pump_period ?? 0,
                doseTime: payload?.peristaltic_pump_duration ?? 0,
              }}
              label={`Waterflow`}
              value={`${payload?.water_flow ?? 0}`}
              helperText={'Setting Waterflow'}
            >
              <div className='flex flex-col gap-5'>
                <CardStatistic.SubItem
                  label={`Pump 1`}
                  value={payload?.pump_1 ? 'On' : 'Off'}
                  small
                />
                <CardStatistic.SubItem
                  label={`Pump 2`}
                  value={payload?.pump_2 ? 'On' : 'Off'}
                  small
                />
              </div>
            </CardStatistic>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
