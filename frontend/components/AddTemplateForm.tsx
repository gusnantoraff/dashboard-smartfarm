import React, { useEffect, useState } from 'react';
import {
  Flex,
  Button,
  Input,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
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
  FormLabel
} from '@chakra-ui/react';
import FormItem from './FormItem';

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
  const [dap, setDap] = useState<number>();
  const [ph, setPh] = useState<number>(4);
  const [humidity, setHumidity] = useState<string>('');
  const [airTemp, setAirTemp] = useState<string>('');
  const [waterTemp, setWaterTemp] = useState<string>('');
  const [waterflow, setWaterflow] = useState<string>('');
  const [showEc, setShowEc] = useState<boolean>(false);
  const [showPh, setShowPh] = useState<boolean>(false);
  const [showHumidity, setShowHumidity] = useState<boolean>(false);
  const [showAirTemp, setShowAirTemp] = useState<boolean>(false);
  const [showWaterTemp, setShowWaterTemp] = useState<boolean>(false);
  const [showWaterflow, setShowWaterflow] = useState<boolean>(false);
  const [ecData, setEcData] = useState<DataItem[]>([{ id: 1, value: 0 }]);
  const [phData, setPhData] = useState<DataItem[]>([{ id: 1, value: 0 }]);
  const [humidityData, setHumidityData] = useState<DataItem[]>([{ id: 1, value: 0 }]);
  const [waterTempData, setwaterTempData] = useState<DataItem[]>([{ id: 1, value: 0 }]);
  const [airTempData, setairTempData] = useState<DataItem[]>([{ id: 1, value: 0 }]);
  const [waterflowData, setWaterflowData] = useState<DataItem[]>([{ id: 1, value: 0 }]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [clusterId, setClusterId] = useState('');
  const [clusters, setClusters] = useState<Cluster[]>([]);

  const handleAddData = (data: DataItem[], setData: React.Dispatch<React.SetStateAction<DataItem[]>>) => {
    setData([...data, { id: data.length + 1, value: 0 }]);
  };

  const handleDeleteData = (id: number, data: DataItem[], setData: React.Dispatch<React.SetStateAction<DataItem[]>>) => {
    setData(data.filter(item => item.id !== id));
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const configEcDap = {
      ph,
      humidity,
      airTemp,
      waterTemp,
      waterflow
    };

    const data = {
      name: templateName,
      dap_count: dap,
      config_ec_dap: configEcDap,
      is_active: true,
      cluster_id: clusterId
    };

    console.log('Data to be sent:', data);

    try {
      const response = await fetch('http://localhost:4000/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
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
  
  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    try {
      const response = await fetch('http://localhost:4000/clusters/all');
      const data = await response.json();
      setClusters(data);
    } catch (error) {
      console.error('Error fetching clusters:', error);
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
          <FormLabel fontSize="14px" fontWeight="bold">pH</FormLabel>
          <Flex alignItems="center">
            <Slider
              defaultValue={4}
              min={0}
              max={10}
              step={1}
              value={ph}
              onChange={(val) => setPh(val)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={4}>
                <Box color="tomato" />
              </SliderThumb>
            </Slider>
            <Box ml="2">{ph}</Box>
          </Flex>
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">Humidity</FormLabel>
          <Select
            placeholder="Humidity"
            _placeholder={{ color: 'gray.500' }}
            size="sm"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
          >
            <option value="20">20°C</option>
            <option value="25">25°C</option>
            <option value="30">30°C</option>
            <option value="35">35°C</option>
          </Select>
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">Air Temperature</FormLabel>
          <Select
            placeholder="Select Air Temperature"
            _placeholder={{ color: 'gray.500' }}
            size="sm"
            value={airTemp}
            onChange={(e) => setAirTemp(e.target.value)}
          >
            <option value="20">20°C</option>
            <option value="25">25°C</option>
            <option value="30">30°C</option>
            <option value="35">35°C</option>
          </Select>
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">Water Temperature</FormLabel>
          <Select
            placeholder="Select Water Temperature"
            _placeholder={{ color: 'gray.500' }}
            size="sm"
            value={waterTemp}
            onChange={(e) => setWaterTemp(e.target.value)}
          >
            <option value="20">20°C</option>
            <option value="25">25°C</option>
            <option value="30">30°C</option>
            <option value="35">35°C</option>
          </Select>
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">Waterflow</FormLabel>
          <Input
            placeholder="Waterflow"
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
         {showAirTemp &&(
            <Tab fontSize="14px">Air Temperature</Tab>
          )}
          {showWaterTemp &&(
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
                        <Input
                          size="sm"
                          value={item.value}
                          onChange={(e) => {
                            const newData = [...ecData];
                            newData[index].value = Number(e.target.value);
                            setEcData(newData);
                          }}
                        />
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
                        <Input
                          size="sm"
                          value={item.value}
                          onChange={(e) => {
                            const newData = [...phData];
                            newData[index].value = Number(e.target.value);
                            setPhData(newData);
                          }}
                        />
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
                        <Input
                          size="sm"
                          value={item.value}
                          onChange={(e) => {
                            const newData = [...humidityData];
                            newData[index].value = Number(e.target.value);
                            setHumidityData(newData);
                          }}
                        />
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
                        <Input
                          size="sm"
                          value={item.value}
                          onChange={(e) => {
                            const newData = [...airTempData];
                            newData[index].value = Number(e.target.value);
                            setairTempData(newData);
                          }}
                        />
                      </Td>
                      <Td>
                        <Button colorScheme="red" size="xs" onClick={() => handleDeleteData(item.id, airTempData, setairTempData)}>Delete</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Button mt="3" colorScheme="blue" size="sm" onClick={() => handleAddData(airTempData, setairTempData)}>Add New DAP</Button>
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
                        <Input
                          size="sm"
                          value={item.value}
                          onChange={(e) => {
                            const newData = [...waterTempData];
                            newData[index].value = Number(e.target.value);
                            setwaterTempData(newData);
                          }}
                        />
                      </Td>
                      <Td>
                        <Button colorScheme="red" size="xs" onClick={() => handleDeleteData(item.id, waterTempData, setwaterTempData)}>Delete</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Button mt="3" colorScheme="blue" size="sm" onClick={() => handleAddData(waterTempData, setwaterTempData)}>Add New DAP</Button>
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
                        <Input
                          size="sm"
                          value={item.value}
                          onChange={(e) => {
                            const newData = [...waterflowData];
                            newData[index].value = Number(e.target.value);
                            setWaterflowData(newData);
                          }}
                        />
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
