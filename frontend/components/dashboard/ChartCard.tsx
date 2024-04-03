import React, { useState, useEffect, useMemo } from 'react';
import { Box, Skeleton, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import Select from '@/components/Select';
import { parseToOption } from '@/utils/parseToOptions';
import DetailItem from '@/components/Detailitem';
import LinkBox from '@/components/LinkBox';
import dayjs from 'dayjs';
import useMqtt from '@/hooks/useMqtt';
import { MqttPayloadType } from '@/types';
import { DetailControllerResponse } from '@/hooks/useController';
import { DetailClusterResponse } from '@/hooks/useCluster';
import Datepicker from '../Datepicker';
import Table, { Columns } from '../Table';
import TemperatureChart from './TemperatureChart';
import HumidityChart from './HumidityChart';
import EcChart from './EcChart';
import PhChart from './PhChart';

type Props = {
  data: DetailControllerResponse | undefined;
  cluster: DetailClusterResponse | undefined;
  setControllerId: (value: any) => void;
};

const StatusComponent = ({ status }: { status: boolean | undefined }) => {
  return (
    <div
      className={`${
        status ? 'bg-[#84FDAA73] text-[#1D976C]' : 'bg-[#FFCDCD] text-[#F83E33]'
      } w-[50px] h-[24px] rounded-[4px] flex justify-center items-center`}
    >
      <span className='font-semibold text-xs'>{status ? 'ON' : 'OFF'}</span>
    </div>
  );
};

export default function ChartCard({ data, cluster, setControllerId }: Props) {
  const { mqtt } = useMqtt();
  const [payload, setPayload] = useState<MqttPayloadType>();
  const [loadingChart, setLoadingChart] = useState<boolean>(true);

  const [tabIdx, setTabIdx] = useState<number>(0);

  useEffect(() => {
    if (mqtt) {
      const controllerName = data?.DetailController?.name;
      mqtt.on('message', (_, message) => {
        const mqttPayload: MqttPayloadType = JSON.parse(message.toString());
        if (
          mqttPayload.from === controllerName &&
          mqttPayload.action_type === 'controller_log'
        ) {
          setPayload(mqttPayload);
        }
      });
    }
  }, [mqtt, data]);

  const columns = useMemo<Columns[]>(() => {
    const tempColumns: Columns[] = [
      {
        name: 'Name',
        selector: () =>
          data?.DetailController?.name.split('/')?.[1] ||
          data?.DetailController?.name,
      },
      {
        name: 'Date',
        selector: (row) => row.date,
      },
      {
        name: 'Upper Limit',
        selector: (row) => row.upperLimit,
      },
      {
        name: 'Lower Limit',
        selector: (row) => row.lowerLimit,
      },
    ];

    switch (tabIdx) {
      case 0:
        tempColumns.push(
          {
            name: 'Water Temperature',
            selector: (row) => row.waterTemperature,
          },
          {
            name: 'Air Temperature',
            selector: (row) => row.airTemperature,
          },
        );
        break;
      case 1:
        tempColumns.push({
          name: 'Humidity',
          selector: (row) => row.humidity,
        });
        break;
      case 2:
        tempColumns.push({
          name: 'EC Status',
          selector: (row) => row.ec,
        });
        break;
      case 3:
        tempColumns.push({
          name: 'pH Status',
          selector: (row) => row.ph,
        });
        break;
      default:
        break;
    }

    tempColumns.push({
      name: 'Status',
      selector: (row) => row.status,
    });

    return tempColumns;
  }, [tabIdx, data]);

  const dummyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      id: i,
      name: 'Controller 1',
      date: dayjs().add(i, 'day').format('DD/MM/YYYY'),
      upperLimit: Math.floor(Math.random() * 100) + 1,
      lowerLimit: Math.floor(Math.random() * 100) + 1,
      waterTemperature: Math.floor(Math.random() * 100) + 1,
      airTemperature: Math.floor(Math.random() * 100) + 1,
      status: 'Dummy data',
    }));
  }, [data]);

  const getChartByIdx = (idx: number) => {
    switch (idx) {
      case 0:
        return <TemperatureChart data={data} payload={payload} />;
      case 1:
        return <HumidityChart data={data} payload={payload} />;
      case 2:
        return <EcChart data={data} payload={payload} />;
      case 3:
        return <PhChart data={data} payload={payload} />;
      default:
        return (
          <Box
            w={'100%'}
            h='520px'
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            <span>Tidak ada data</span>
          </Box>
        );
    }
  };

  useEffect(() => {
    if (payload) {
      setLoadingChart(false);
    }

    const timeout = setTimeout(() => {
      if (!payload) {
        setTabIdx(999);
        setLoadingChart(false);
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, [tabIdx, payload]);

  return (
    <div className='p-4'>
      <div className='border border-[#C4C4C4] rounded-lg'>
        <div className='border-b border-b-[#C4C4C4]'>
          <Tabs isLazy index={tabIdx}>
            <TabList
              borderRadius={'12px'}
              fontWeight={600}
              color='#C4C4C4'
              border='0px'
            >
              <Tab
                key={0}
                onClick={() => {
                  setTabIdx(0);
                }}
                py='15px'
                fontSize={'14px'}
                _selected={{
                  color: 'primary',
                  borderBottomWidth: '0',
                  borderBottomColor: 'primary',
                }}
                display={'flex'}
                gap={'6px'}
                position={'relative'}
              >
                <span>Temperature</span>
                <div
                  className={`absolute h-1 bottom-[1.4px] rounded-t-[10px] bg-primary w-[64px] transition-all duration-150 ${
                    tabIdx === 0 ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </Tab>
              <Tab
                key={1}
                onClick={() => {
                  setTabIdx(1);
                }}
                py='15px'
                fontSize={'14px'}
                _selected={{
                  color: 'primary',
                  borderBottomWidth: '0',
                  borderBottomColor: 'primary',
                }}
                display={'flex'}
                gap={'6px'}
                position={'relative'}
              >
                <span>Humidity</span>
                <div
                  className={`absolute h-1 bottom-[1.4px] rounded-t-[10px] bg-primary w-[64px] transition-all duration-150 ${
                    tabIdx === 1 ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </Tab>
              <Tab
                key={2}
                onClick={() => {
                  setTabIdx(2);
                }}
                py='15px'
                fontSize={'14px'}
                _selected={{
                  color: 'primary',
                  borderBottomWidth: '0',
                  borderBottomColor: 'primary',
                }}
                display={'flex'}
                gap={'6px'}
                position={'relative'}
              >
                <span>EC Status</span>
                <div
                  className={`absolute h-1 bottom-[1.4px] rounded-t-[10px] bg-primary w-[64px] transition-all duration-150 ${
                    tabIdx === 2 ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </Tab>
              <Tab
                key={3}
                onClick={() => {
                  setTabIdx(3);
                }}
                py='15px'
                fontSize={'14px'}
                _selected={{
                  color: 'primary',
                  border: '0px',
                }}
                display={'flex'}
                gap={'6px'}
                position={'relative'}
              >
                <span>pH Status</span>
                <div
                  className={`absolute h-1 bottom-[1.4px] rounded-t-[10px] bg-primary w-[64px] transition-all duration-150 ${
                    tabIdx === 3 ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </Tab>
            </TabList>
          </Tabs>
        </div>

        <div className='flex flex-col-reverse lg:flex-row'>
          <div className='min-h-[492px] border-r border-r-[#C4C4C4] flex-1 lg:flex-[0.3] pb-3'>
            <div className='pl-4 pt-4 pr-4'>
              <Select
                h='40px'
                bg='other.02'
                mb='16px'
                options={parseToOption(
                  cluster?.DetailCluster?.controllers || [],
                  'name',
                  'id',
                )}
                onSelect={(value) => {
                  setControllerId(value);
                }}
                selected={data?.DetailController?.id}
              />

              <DetailItem.Border small />

              <p className='text-sm text-[#929EAE] font-medium'>
                ID&nbsp;
                <span className='text-[#929EAE] font-semibold'>
                  {data?.DetailController?.id.split('-')?.[0] ||
                    data?.DetailController?.id}
                </span>
              </p>
              <div className='flex w-full justify-between'>
                <LinkBox href={`/controller/${data?.DetailController?.id}`}>
                  <Text fontSize={'20px'} color={'primary'} fontWeight={600}>
                    {data?.DetailController?.name?.split('/')?.[1] ||
                      data?.DetailController?.name}
                  </Text>
                </LinkBox>
              </div>

              <DetailItem.Border small />
            </div>

            <DetailItem
              label='Planting Date'
              value={dayjs(payload?.dap_date).format('MMMM DD, YYYY')}
              loading={!payload}
            />
            <DetailItem
              loading={!payload}
              gray
              label='DAP'
              value={`${payload?.dap_days} Days ${payload?.dap_time}`}
            />
            <DetailItem
              loading={!payload}
              label='Harvest Estimation'
              value={`${payload?.dap.length} Days`}
            />
            <DetailItem
              loading={!payload}
              gray
              label='Water Flow'
              value={payload?.waterflow}
            />
            <DetailItem
              loading={!payload}
              label='Pump 01 Status'
              value={<StatusComponent status={payload?.pump_1} />}
            />
            <DetailItem
              loading={!payload}
              gray
              label='Pump 02 Status'
              value={<StatusComponent status={payload?.pump_2} />}
            />
            <DetailItem
              loading={!payload}
              label='Heater Status'
              value={<StatusComponent status={payload?.heater} />}
            />
            <DetailItem
              loading={!payload}
              gray
              label='Fan Status'
              value={<StatusComponent status={payload?.fan} />}
            />
          </div>

          <div className='pb-3 flex-1 lg:flex-[0.7]'>
            {loadingChart ? (
              <Skeleton w={'100%'} h='520px' />
            ) : (
              getChartByIdx(tabIdx)
            )}
          </div>
        </div>
      </div>

      <div className='mt-4'>
        <div className='border border-[#C4C4C4] rounded-lg p-4'>
          <div className='w-full flex gap-2 mb-4'>
            <Select
              options={parseToOption(['Daily', 'Weekly'])}
              onSelect={() => {}}
              bg='other.02'
              h='40px'
              w='160px'
              flex={0.15}
            />
            <Datepicker bg='other.02' h='40px' w='266px' />
          </div>

          <Table data={dummyData} columns={columns} />
        </div>
      </div>
    </div>
  );
}
