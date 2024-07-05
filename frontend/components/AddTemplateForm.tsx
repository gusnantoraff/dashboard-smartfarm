import React, { useEffect, useState } from 'react';
import {
  Flex,
  Button,
  Input,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  SliderTrack,
  Slider,
  SliderFilledTrack,
  SliderThumb
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';

interface DataItem {
  id: number;
  value: number;
}

interface AddTemplateFormProps {
  handleAddTemplateOrAI: () => Promise<void>;
}

interface Cluster {
  cluster_id: string;
  name: string;
}

const AddTemplateForm: React.FC<AddTemplateFormProps> = (props) => {
  const [templateName, setTemplateName] = useState<string>('');
  const [dap, setDap] = useState<number>(10);
  const [ec, setEc] = useState<number>(1.5);
  const [phRange, setPhRange] = useState<[number, number]>([0, 14]);
  const [humidity, setHumidity] = useState<number>(60);
  const [airTempRange, setAirTempRange] = useState<[number, number]>([0, 50]);
  const [waterTemp, setWaterTemp] = useState<number>(20);
  const [waterflow, setWaterflow] = useState<string>('');
  const [showEc, setShowEc] = useState<boolean>(false);
  const [showPh, setShowPh] = useState<boolean>(false);
  const [showHumidity, setShowHumidity] = useState<boolean>(false);
  const [showAirTemp, setShowAirTemp] = useState<boolean>(false);
  const [showWaterTemp, setShowWaterTemp] = useState<boolean>(false);
  const [showWaterflow, setShowWaterflow] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [clusterId, setClusterId] = useState('');
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [templateId] = useState<string>('');

  const [ecData, setEcData] = useState<DataItem[]>([]);
  const [phData, setPhData] = useState<DataItem[]>([]);
  const [humidityData, setHumidityData] = useState<DataItem[]>([]);
  const [airTempData, setAirTempData] = useState<DataItem[]>([]);
  const [waterTempData, setWaterTempData] = useState<DataItem[]>([]);
  const [waterflowData, setWaterflowData] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchClustersAndInitializeData = async () => {
      try {
        const response = await fetch('http://localhost:4000/clusters/all');
        if (!response.ok) {
          throw new Error('Failed to fetch clusters');
        }
        const data = await response.json();
        setClusters(data);

        initializeSensorData(dap);
      } catch (error) {
        console.error('Error fetching clusters:', error);
      }
    };

    fetchClustersAndInitializeData();
  }, [dap]);

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/template/${templateId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch template details');
        }
        const data = await response.json();
        setTemplateName(data.name);
        setDap(data.dap_count);
        setClusterId(data.cluster_id);

        setShowEc(data.config_ec_dap.ec !== '');
        setShowPh(data.ph !== '');
        setShowHumidity(data.humidity !== '');
        setShowAirTemp(data.airTemperature !== '');
        setShowWaterTemp(data.waterTemperature !== '');
        setShowWaterflow(data.waterflow !== '');

        initializeSensorData(data.dap_count);
      } catch (error) {
        console.error('Error fetching template details:', error);
      }
    };

    fetchTemplateDetails();
  }, [templateId]);

  const initializeSensorData = (dapCount: number) => {
    const initializeData = (length: number): DataItem[] =>
      Array.from({ length }, (_, i) => ({ id: i + 1, value: 0 }));

    setEcData(initializeData(dapCount));
    setPhData(initializeData(dapCount));
    setHumidityData(initializeData(dapCount));
    setAirTempData(initializeData(dapCount));
    setWaterTempData(initializeData(dapCount));
    setWaterflowData(initializeData(dapCount));
  };

  const handleAddData = (data: DataItem[], setData: React.Dispatch<React.SetStateAction<DataItem[]>>, count: number = 1) => {
    const newData = [...data];
    for (let i = 0; i < count; i++) {
      newData.push({ id: newData.length + 1, value: 0 });
    }
    setData(newData);
  };

  const handleDeleteData = (id: number, data: DataItem[], setData: React.Dispatch<React.SetStateAction<DataItem[]>>) => {
    setData(data.filter(item => item.id !== id));
  };

  const handleIncrement = (id: number, data: DataItem[], setData: React.Dispatch<React.SetStateAction<DataItem[]>>) => {
    setData(data.map(d => d.id === id ? { ...d, value: d.value + 1 } : d));
  };

  const handleDecrement = (id: number, data: DataItem[], setData: React.Dispatch<React.SetStateAction<DataItem[]>>) => {
    setData(data.map(d => d.id === id ? { ...d, value: d.value - 1 } : d));
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);

    const configEcDap = {
      ec: ec,
      date_start: new Date(),
      date_end: new Date(),
      dap_num: dap,
      config_ec_dap_id: uuidv4(),
      controller_session_id: uuidv4(),
      config_sensor_id: uuidv4(),
      log_controller_id: uuidv4()
    };

    const data = {
      config_ec_dap: configEcDap,
      cluster_id: clusterId,
      name: templateName,
      dap_count: dap,
      is_active: true,
      ecData: Array.from({ length: dap }, (_, i) => ({ id: i + 1, value: 0, note: '' })),
      ec: ec,
      ph: phRange,
      ph_up: phRange[0],
      ph_down: phRange[1],
      humidity: humidity,
      temperature_water: waterTemp,
      temperature_air: airTempRange,
      temperature_air_min: airTempRange[0],
      temperature_air_max: airTempRange[1],
      water_flow: waterflow
    };

    console.log('Data to be sent:', JSON.stringify(data));

    try {
      const response = await fetch('http://localhost:4000/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
      console.log('Response from backend:', result);
  
      if (response.ok) {
        console.log('Template added successfully');
        await props.handleAddTemplateOrAI();
      } else {
        console.error('Failed to add template');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box p="4">
      <Flex direction="column" mb="6" fontSize="14px">
        <Flex mb="3">
          <FormControl flex="1">
            <Checkbox isChecked={showEc} onChange={(e) => setShowEc(e.target.checked)} /> Ec
          </FormControl>
          <FormControl flex="1">
            <Checkbox isChecked={showPh} onChange={(e) => setShowPh(e.target.checked)} /> pH
          </FormControl>
          <FormControl flex="1">
            <Checkbox isChecked={showHumidity} onChange={(e) => setShowHumidity(e.target.checked)} /> Humidity
          </FormControl>
        </Flex>
        <Flex mb="3">
          <FormControl flex="1">
            <Checkbox isChecked={showAirTemp} onChange={(e) => setShowAirTemp(e.target.checked)} /> Air Temperature
          </FormControl>
          <FormControl flex="1">
            <Checkbox isChecked={showWaterTemp} onChange={(e) => setShowWaterTemp(e.target.checked)} /> Water Temperature
          </FormControl>
          <FormControl flex="1">
            <Checkbox isChecked={showWaterflow} onChange={(e) => setShowWaterflow(e.target.checked)} /> Waterflow
          </FormControl>
        </Flex>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">Cluster</FormLabel>
          <Select
            placeholder="Select Cluster"
            _placeholder={{ color: 'gray.500' }}
            size="sm"
            value={clusterId}
            onChange={(e) => setClusterId(e.target.value)}
          >
            {clusters.map(cluster => (
              <option key={cluster.cluster_id} value={cluster.cluster_id}>{cluster.name}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">Template Name</FormLabel>
          <Input
            placeholder="Template Name"
            _placeholder={{ color: 'gray.500' }}
            size="sm"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">DAP</FormLabel>
          <Select
            placeholder="Select DAP"
            _placeholder={{ color: 'gray.500' }}
            size="sm"
            value={dap}
            onChange={(e) => setDap(parseInt(e.target.value))}
          >
            <option value="10">10 Days</option>
            <option value="15">15 Days</option>
            <option value="20">20 Days</option>
            <option value="25">25 Days</option>
            <option value="30">30 Days</option>
            <option value="35">35 Days</option>
          </Select>
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">EC</FormLabel>
          <Input
            type='number'
            placeholder="EC"
            _placeholder={{ color: 'gray.500' }}
            size="sm"
            value={ec}
            onChange={(e) => setEc(parseFloat(e.target.value))}
          />
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">pH</FormLabel>
          <Flex alignItems="center">
            <Box ml="2">{phRange[0]}</Box>
            <Box ml="2" mr="2" flex="1"></Box>
            <RangeSlider
              min={0}
              max={14}
              step={1}
              value={phRange}
              onChange={(val) => setPhRange([val[0], val[1]])}
              size="sm"
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb boxSize={3} index={0} bg="blue.500" />
              <RangeSliderThumb boxSize={3} index={1} bg="blue.500" />
            </RangeSlider>
            <Box ml="2">{phRange[1]}</Box>
          </Flex>
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">Humidity</FormLabel>
          <Flex alignItems="center">
          <Slider
              defaultValue={60}
              min={0}
              max={100}
              step={1}
              value={humidity}
              onChange={(val) => setHumidity(val)}
              size="sm"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={3} bg="blue.500">
                <Box color="tomato" />
              </SliderThumb>
            </Slider>
            <Box ml="2">{humidity}%</Box>
          </Flex>
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">Air Temperature</FormLabel>
          <Flex alignItems="center">
            <Box ml="2">{airTempRange[0]}°C</Box>
            <Box ml="2" mr="2" flex="1"></Box>
            <RangeSlider
              min={0}
              max={50}
              step={1}
              value={airTempRange}
              onChange={(val) => setAirTempRange([val[0], val[1]])}
              size="sm"
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb boxSize={3} index={0} bg="blue.500" />
              <RangeSliderThumb boxSize={3} index={1} bg="blue.500" />
            </RangeSlider>
            <Box ml="2">{airTempRange[1]}°C</Box>
          </Flex>
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">Water Temperature</FormLabel>
          <Flex alignItems="center">
          <Slider
              defaultValue={20}
              min={0}
              max={50}
              step={1}
              value={waterTemp}
              onChange={(val) => setWaterTemp(val)}
              size="sm"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={3} bg="blue.500">
                <Box color="tomato" />
              </SliderThumb>
            </Slider>
            <Box ml="2">{waterTemp}°C</Box>
          </Flex>
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">Waterflow</FormLabel>
          <Input
            placeholder="Waterflow (L/m)"
            _placeholder={{ color: 'gray.500' }}
            size="sm"
            value={waterflow}
            onChange={(e) => setWaterflow(e.target.value)}
          />
        </FormControl>
      </Flex>

      <Tabs isLazy>
        <TabList>
          {showEc && (
            <Tab fontSize="14px">EC</Tab>
          )}
          {showPh && (
            <Tab fontSize="14px">pH</Tab>
          )}
          {showHumidity && (
            <Tab fontSize="14px">Humidity</Tab>
          )}
          {showAirTemp && (
            <Tab fontSize="14px">Air Temperature</Tab>
          )}
          {showWaterTemp && (
            <Tab fontSize="14px">Water Temperature</Tab>
          )}
          {showWaterflow && (
            <Tab fontSize="14px">Waterflow</Tab>
          )}
        </TabList>

        <TabPanels>
          {showEc && (
            <TabPanel>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>#No</Th>
                    <Th>EC Value / DAP</Th>
                    <Th>Setting</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {ecData.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.id}</Td>
                      <Td>EC Value DAP {item.id}</Td>
                      <Td>
                        <Flex alignItems="center">
                          <Button size="sm" onClick={() => handleDecrement(item.id, ecData, setEcData)}>-</Button>
                          <Input
                            value={item.value}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value)) {
                                setEcData(ecData.map(d => d.id === item.id ? { ...d, value } : d));
                              }
                            }}
                            size="sm"
                            width="40px"
                          />
                          <Button size="sm" onClick={() => handleIncrement(item.id, ecData, setEcData)}>+</Button>
                        </Flex>
                      </Td>
                      <Td>
                        <Button colorScheme="red" size="xs" onClick={() => handleDeleteData(item.id, ecData, setEcData)}>Delete</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Button mt="3" colorScheme="blue" size="sm" onClick={() => handleAddData(ecData, setEcData)}>Add New DAP</Button>
            </TabPanel>
          )}
          {showPh && (
            <TabPanel>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>#No</Th>
                    <Th>pH Value / DAP</Th>
                    <Th>Setting</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {phData.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.id}</Td>
                      <Td>pH Value DAP {item.id}</Td>
                      <Td>
                        <Flex alignItems="center">
                          <Button size="sm" onClick={() => handleDecrement(item.id, phData, setPhData)}>-</Button>

                          <Input
                            value={item.value}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value)) {
                                setPhData(phData.map(d => d.id === item.id ? { ...d, value } : d));
                              }
                            }}
                            size="sm"
                            width="40px"
                          />
                          <Button size="sm" onClick={() => handleIncrement(item.id, phData, setPhData)}>+</Button>
                        </Flex>
                      </Td>
                      <Td>
                        <Button colorScheme="red" size="xs" onClick={() => handleDeleteData(item.id, phData, setPhData)}>Delete</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Button mt="3" colorScheme="blue" size="sm" onClick={() => handleAddData(phData, setPhData)}>Add New DAP</Button>
            </TabPanel>
          )}
          {showHumidity && (
            <TabPanel>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>#No</Th>
                    <Th>Humidity Value / DAP</Th>
                    <Th>Setting</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {humidityData.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.id}</Td>
                      <Td>Humidity Value DAP {item.id}</Td>
                      <Td>
                        <Flex alignItems="center">
                          <Button size="sm" onClick={() => handleDecrement(item.id, humidityData, setHumidityData)}>-</Button>

                          <Input
                            value={item.value}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value)) {
                                setHumidityData(humidityData.map(d => d.id === item.id ? { ...d, value } : d));
                              }
                            }}
                            size="sm"
                            width="40px"
                          />
                          <Button size="sm" onClick={() => handleIncrement(item.id, humidityData, setHumidityData)}>+</Button>
                        </Flex>
                      </Td>
                      <Td>
                        <Button colorScheme="red" size="xs" onClick={() => handleDeleteData(item.id, humidityData, setHumidityData)}>Delete</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Button mt="3" colorScheme="blue" size="sm" onClick={() => handleAddData(humidityData, setHumidityData)}>Add New DAP</Button>
            </TabPanel>
          )}
          {showAirTemp && (
            <TabPanel>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>#No</Th>
                    <Th>Air Temperature Value / DAP</Th>
                    <Th>Setting</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {airTempData.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.id}</Td>
                      <Td>Air Temperature Value DAP {item.id}</Td>
                      <Td>
                        <Flex alignItems="center">
                          <Button size="sm" onClick={() => handleDecrement(item.id, airTempData, setAirTempData)}>-</Button>

                          <Input
                            value={item.value}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value)) {
                                setAirTempData(airTempData.map(d => d.id === item.id ? { ...d, value } : d));
                              }
                            }}
                            size="sm"
                            width="40px"
                          />
                          <Button size="sm" onClick={() => handleIncrement(item.id, airTempData, setAirTempData)}>+</Button>
                        </Flex>
                      </Td>
                      <Td>
                        <Button colorScheme="red" size="xs" onClick={() => handleDeleteData(item.id, airTempData, setAirTempData)}>Delete</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Button mt="3" colorScheme="blue" size="sm" onClick={() => handleAddData(airTempData, setAirTempData)}>Add New DAP</Button>
            </TabPanel>
          )}
          {showWaterTemp && (
            <TabPanel>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>#No</Th>
                    <Th>Water Temperature Value / DAP</Th>
                    <Th>Setting</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {waterTempData.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.id}</Td>
                      <Td>Water Temperature Value DAP {item.id}</Td>
                      <Td>
                        <Flex alignItems="center">
                          <Button size="sm" onClick={() => handleDecrement(item.id, waterTempData, setWaterTempData)}>-</Button>

                          <Input
                            value={item.value}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value)) {
                                setWaterTempData(waterTempData.map(d => d.id === item.id ? { ...d, value } : d));
                              }
                            }}
                            size="sm"
                            width="40px"
                          />
                          <Button size="sm" onClick={() => handleIncrement(item.id, waterTempData, setWaterTempData)}>+</Button>
                        </Flex>
                      </Td>
                      <Td>
                        <Button colorScheme="red" size="xs" onClick={() => handleDeleteData(item.id, waterTempData, setWaterTempData)}>Delete</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Button mt="3" colorScheme="blue" size="sm" onClick={() => handleAddData(waterTempData, setWaterTempData)}>Add New DAP</Button>
            </TabPanel>
          )}
          {showWaterflow && (
            <TabPanel>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>#No</Th>
                    <Th>Waterflow Value / DAP</Th>
                    <Th>Setting</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {waterflowData.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.id}</Td>
                      <Td>Waterflow Value DAP {item.id}</Td>
                      <Td>
                        <Flex alignItems="center">
                          <Button size="sm" onClick={() => handleDecrement(item.id, waterflowData, setWaterflowData)}>-</Button>

                          <Input
                            value={item.value}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value)) {
                                setWaterflowData(waterflowData.map(d => d.id === item.id ? { ...d, value } : d));
                              }
                            }}
                            size="sm"
                            width="40px"
                          />
                          <Button size="sm" onClick={() => handleIncrement(item.id, waterflowData, setWaterflowData)}>+</Button>
                        </Flex>
                      </Td>
                      <Td>
                        <Button colorScheme="red" size="xs" onClick={() => handleDeleteData(item.id, waterflowData, setWaterflowData)}>Delete</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Button mt="3" colorScheme="blue" size="sm" onClick={() => handleAddData(waterflowData, setWaterflowData)}>Add New DAP</Button>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
      <Flex mt="6" justifyContent="right">
        <Button colorScheme="blue" size="sm" onClick={handleSubmit} isLoading={submitLoading}>Add</Button>
      </Flex>
    </Box>
  );
};

export default AddTemplateForm;

