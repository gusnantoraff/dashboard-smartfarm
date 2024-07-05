import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Button, Skeleton, Tab, TabList, Tabs, Text, useToast } from '@chakra-ui/react';
import Select from '@/components/Select';
import { parseToOption } from '@/utils/parseToOptions';
import DetailItem from '@/components/Detailitem';
import LinkBox from '@/components/LinkBox';
import dayjs from 'dayjs';
import useMqtt from '@/hooks/useMqtt';
import { MqttPayloadType } from '@/types';
import Datepicker from '../Datepicker';
import Table from '../Table';
import TemperatureChart from './TemperatureChart';
import HumidityChart from './HumidityChart';
import EcChart from './EcChart';
import PhChart from './PhChart';
import axios from 'axios';
import Cookies from 'js-cookie';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

type Columns = {
  name: string;
  selector: (row: any) => any;
};

type Props = {
  clusterId?: string | null;
  pagination: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  onPageChange: (page: number) => void;
};

const StatusComponent = ({ status }: { status: boolean | undefined }) => {
  return (
    <div
      className={`${status ? 'bg-[#84FDAA73] text-[#1D976C]' : 'bg-[#FFCDCD] text-[#F83E33]'
        } w-[50px] h-[24px] rounded-[4px] flex justify-center items-center`}
    >
      <span className='font-semibold text-xs'>{status ? 'ON' : 'OFF'}</span>
    </div>
  );
};

export default function ChartCard({ clusterId, pagination, onPageChange }: Props) {
  const { mqtt } = useMqtt();
  const toast = useToast();
  const [payload, setPayload] = useState<MqttPayloadType>();
  const [loadingChart, setLoadingChart] = useState<boolean>(true);
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [clusters, setCluster] = useState<any>(null);
  const [controllers, setController] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [selectedControllerId, setSelectedControllerId] = useState<string | null>(null);

  const chartRef = useRef<HTMLDivElement>(null);

  const fetchCluster = async () => {
    if (clusterId) {
      setLoading(true);
      try {
        const clusterResponse = await axios.get(`http://localhost:4000/clusters/${clusterId}`);
        setCluster(clusterResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cluster data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchController = async () => {
    if (selectedControllerId) {
      try {
        const controllerResponse = await axios.get(`http://localhost:4000/controllers/${selectedControllerId}`);
        setController(controllerResponse.data);
        const cookiePayload = Cookies.get(`mqttPayload_${controllerResponse.data.name}`);
        if (cookiePayload) {
          setPayload(JSON.parse(cookiePayload));
        }
      } catch (error) {
        console.error('Error fetching controller data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (clusterId) {
      fetchCluster();
    }
    fetchController();
  }, [clusterId, selectedControllerId]);

  useEffect(() => {
    if (mqtt && controllers?.name) {
      const controllerName = controllers.name;
      mqtt.on('message', (_, message) => {
        const mqttPayload: MqttPayloadType = JSON.parse(message.toString());
        if (
          mqttPayload.from === controllerName &&
          mqttPayload.action_type === 'log_controller'
        ) {
          const expirationTime = new Date(new Date().getTime() + 30 * 60 * 1000);
          Cookies.set(`mqttPayload_${controllers?.name}`, JSON.stringify(mqttPayload), { expires: expirationTime, path: '/' });
          setPayload(mqttPayload);
        }
      });
    }
  }, [mqtt, controllers, clusters]);

  console.log('mqtt', payload);
  

  const columns = useMemo<Columns[]>(() => {
    const tempColumns: Columns[] = [
      {
        name: 'Name',
        selector: () =>
          controllers?.name.split('/')?.[1] ||
          controllers?.name,
      },
      {
        name: 'Date',
        selector: (row) => row.date_now,
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
            selector: (row) => row.temperature_water,
          },
          {
            name: 'Air Temperature',
            selector: (row) => row.temperature_air,
          }
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
  }, [tabIdx, controllers]);

  const getChartByIdx = (idx: number) => {
    switch (idx) {
      case 0:
        return <TemperatureChart payload={payload} controllerData={controllers}/>;
      case 1:
        return <HumidityChart payload={payload} controllerData={controllers}/>;
      case 2:
        return <EcChart payload={payload} controllerData={controllers}/>;
      case 3:
        return <PhChart payload={payload} controllerData={controllers}/>;
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

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error Occurred',
        description: 'An error occurred while fetching data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [loading, error, toast]);

  const handlePrint = async () => {
    if (!chartRef.current) return;
  
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFont('helvetica');
    pdf.setFontSize(14);
    pdf.text('Report', 10, 10);
  
    if (payload) {
      const tableData = [
        ['Date', payload.date_now],
        ['Air Temperature', payload.temperature_air],
        ['Water Temperature', payload.temperature_water],
        ['Humidity', payload.humidity],
        ['EC', payload.ec],
        ['pH', payload.ph]
      ];
  
      autoTable(pdf, {
        head: [['Field', 'Value']],
        body: tableData
      });
    }
  
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
    pdf.addImage(imgData, 'PNG', 10, 80, imgWidth, imgHeight);
    pdf.save('report.pdf');
  };
  


  if (loading) {
    return <Skeleton w="100%" h="520px" />;
  }

  return (
    <div className='p-4' ref={chartRef}>
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
                onClick={() => setTabIdx(0)}
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
                  className={`absolute h-1 bottom-[1.4px] rounded-t-[10px] bg-primary w-[64px] transition-all duration-150 ${tabIdx === 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                />
              </Tab>
              <Tab
                key={1}
                onClick={() => setTabIdx(1)}
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
                  className={`absolute h-1 bottom-[1.4px] rounded-t-[10px] bg-primary w-[64px] transition-all duration-150 ${tabIdx === 1 ? 'opacity-100' : 'opacity-0'
                    }`}
                />
              </Tab>
              <Tab
                key={2}
                onClick={() => setTabIdx(2)}
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
                  className={`absolute h-1 bottom-[1.4px] rounded-t-[10px] bg-primary w-[64px] transition-all duration-150 ${tabIdx === 2 ? 'opacity-100' : 'opacity-0'
                    }`}
                />
              </Tab>
              <Tab
                key={3}
                onClick={() => setTabIdx(3)}
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
                  className={`absolute h-1 bottom-[1.4px] rounded-t-[10px] bg-primary w-[64px] transition-all duration-150 ${tabIdx === 3 ? 'opacity-100' : 'opacity-0'
                    }`}
                />
              </Tab>
            </TabList>
          </Tabs>
        </div>

        <div className='flex flex-col-reverse lg:flex-row'>
          <div className='min-h-[492px] border-r border-r-[#C4C4C4] flex-1 lg:flex-[0.3] pb-3'>
            <div className='pl-4 pt-4 pr-4'>
              {clusters?.controllers && (
                <>
                  <Select
                    h='40px'
                    bg='other.02'
                    mb='16px'
                    options={parseToOption(clusters.controllers, 'name', 'controller_id')}
                    onSelect={(value: any) => {
                      setSelectedControllerId(value);
                    }}
                    selected={selectedControllerId}
                  />
                  <DetailItem.Border small />
                  <p className='text-sm text-[#929EAE] font-medium'>
                    ID&nbsp;
                    <span className='text-[#929EAE] font-semibold'>
                      {controllers?.controller_id.split('-')?.[0] ||
                        controllers?.controller_id}
                    </span>
                  </p>
                  <div className='flex w-full justify-between'>
                    <LinkBox href={`/controller/${controllers?.controller_id}`}>
                      <Text fontSize={'20px'} color={'primary'} fontWeight={600}>
                        {controllers?.name.split('/')?.[1] ||
                          controllers?.name}
                      </Text>
                    </LinkBox>
                  </div>
                  <DetailItem.Border small />
                </>
              )}
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
              value={`${payload?.dap_count} Days ${payload?.dap_time}`}
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
              value={payload?.water_flow}
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
              onSelect={() => { }}
              bg='other.02'
              h='40px'
              w='160px'
              flex={0.15}
            />
            <Datepicker bg='other.02' h='40px' w='266px' />
          </div>

          <Button colorScheme='teal' size='sm' onClick={handlePrint} mb={4}>
            Print Report
          </Button>

          <Table data={payload ? [payload] : []} columns={columns} pagination={pagination} onPageChange={onPageChange} />
        </div>
      </div>
    </div>
  );
}
