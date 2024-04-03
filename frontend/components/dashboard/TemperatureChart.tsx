import React, { useState } from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Icon,
  SettingsIcon,
} from '@chakra-ui/icons';
import Select from '../Select';
import { parseToOption } from '@/utils/parseToOptions';
import Datepicker from '../Datepicker';
import { Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import { ChartType } from '@/types/chart.type';
import { DetailControllerResponse } from '@/hooks/useController';
import { MqttPayloadType } from '@/types';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const degree = new Intl.NumberFormat('en-US', {
  style: 'unit',
  unit: 'celsius',
});

type Props = {
  data: DetailControllerResponse | undefined;
  payload: MqttPayloadType | undefined;
};

export default function TemperatureChart({ data, payload }: Props) {
  const [chart] = useState<ChartType | null>({
    options: {
      chart: {
        id: 'basic-bar',
        fontFamily: `'Work Sans', sans-serif`,
      },
      xaxis: {
        categories: Array.from({ length: 8 }, (_, i) =>
          dayjs().add(i, 'day').format(),
        ),
        labels: {
          formatter: (value) => {
            return dayjs(value).format('MM/DD/YYYY');
          },
          style: {
            fontWeight: 600,
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => {
            return degree.format(Number(value));
          },
          style: {
            fontWeight: 600,
          },
        },
      },
      legend: {
        show: true,
        horizontalAlign: 'left',
        markers: {
          width: 16,
          height: 16,
          radius: 4,
        },
        height: 18,
        fontSize: '14px',
        fontWeight: 500,
        itemMargin: {
          horizontal: 16,
        },
      },
      tooltip: {
        custom: ({ series, dataPointIndex, w }) => {
          const value1 = series?.[0]?.[dataPointIndex] || 0;
          const value2 = series?.[1]?.[dataPointIndex] || 0;

          const color1 = w?.config?.series[0]?.color || '#014493';
          const color2 = w?.config?.series[1]?.color || '#0085FF';

          const labelY = w.globals.categoryLabels?.[dataPointIndex] || '';

          const controllerName =
            data?.DetailController?.name?.split('/')?.[1] ||
            data?.DetailController?.name;

          return /*html*/ `<div style='border-radius: 8px; width: 200px; font-family: "Work Sans", sans-serif'>
            <div style='padding: 8px 12px; background-color: #014493; display: flex; justify-content: space-between; align-items: center;'>
              <p style='color: #FFF; font-weight: 600; font-size: 12px'>${controllerName}</p>
              <div style='width: 8px; height: 8px; border-radius: 100%; background-color: ${
                data?.DetailController.isActive ? '#16DA41' : '#E5363D'
              }'></div>
            </div>

            <div style='padding: 8px 12px; background-color: #FFFFFF'>
              <p style='margin-bottom: 8px; font-weight: 600; font-size: 12px'>${dayjs(
                labelY,
              ).format('ddd, DD MMM YYYY')}</p>

              <div style='display: flex; gap: 8px; height; 32px; margin-bottom: 8px'>
                <div
                style='height: 32px; width: 4px; background-color: ${color1}; border-radius: 0 4px 4px 0'
                ></div>

                <div style='font-weight: 600; font-size: 12px'>
                  <span>Water Temperature&nbsp;:&nbsp;${degree.format(
                    value1,
                  )}</span>
                  <p style='color: #929EAE; font-weight: 500'>Status&nbsp;:&nbsp;<span style='color: #FFCC00; font-weight: 600'>Above Normal</span>
                  </p>
                </div>
              </div>
              <div style='display: flex; gap: 8px; height; 32px; margin-bottom: 8px'>
                <div
                style='height: 32px; width: 4px; background-color: ${color2}; border-radius: 0 4px 4px 0'
                ></div>

                 <div style='font-weight: 600; font-size: 12px'>
                  <span>Air Temperature&nbsp;:&nbsp;${degree.format(
                    value2,
                  )}</span>
                  <p style='color: #929EAE; font-weight: 500'>Status&nbsp;:&nbsp;<span style='color: #1D976C; font-weight: 600'>Normal</span>
                  </p>
                </div>
              </div>
            </div>
          </div>`;
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: true,
          },
        },
        xaxis: {
          lines: {
            show: true,
          },
        },
        row: {
          colors: ['#F9F9F9', 'transparent'],
        },
      },
    },
    series: [
      {
        name: 'Water Temperature',
        data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 100)),
        color: '#014493',
      },
      {
        name: 'Air Temperature',
        data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 100)),
        color: '#0085FF',
      },
    ],
  });
  return (
    <>
      <div className='w-full flex gap-2 p-4 pb-0 mb-3'>
        <Select
          options={parseToOption(['Daily', 'Weekly'])}
          onSelect={() => {}}
          bg='other.02'
          h='40px'
          flex={0.15}
        />
        <Datepicker bg='other.02' h='40px' flex={0.5} />
        <div className='flex-[0.3] h-[40px] border border-[#C4C4C480] rounded-lg p-2 flex gap-4'>
          <div className='flex-[0.5] flex items-center gap-2'>
            <span className='border border-[#C4C4C480] p-1 w-6 rounded-lg flex justify-center items-center'>
              <Icon
                as={ArrowUpIcon}
                width={'16px'}
                height={'16px'}
                color='tertiary.01'
              />
            </span>
            <Text className='font-semibold text-base'>
              {degree.format(payload?.sf_config_fan_air_temp_max || 0)}
            </Text>
          </div>
          <div className='flex-[0.5] flex items-center gap-2'>
            <span className='border border-[#C4C4C480] p-1 w-6 rounded-lg flex justify-center items-center'>
              <Icon
                as={ArrowDownIcon}
                width={'16px'}
                height={'16px'}
                color='tertiary.02'
              />
            </span>
            <Text className='font-semibold text-base'>
              {degree.format(payload?.sf_config_fan_air_temp_min || 0)}
            </Text>
          </div>
        </div>

        <div
          className='flex-[0.05] h-[40px] border
              hover:bg-[#c4c4c437] transition-all duration-200 cursor-pointer
              border-[#C4C4C480] rounded-lg flex bg-white justify-center items-center'
        >
          <Icon as={SettingsIcon} width={'16px'} height={'16px'} color='#000' />
        </div>
      </div>

      <Chart options={chart?.options} series={chart?.series} height={436} />
    </>
  );
}
