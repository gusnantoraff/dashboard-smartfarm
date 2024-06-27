import React, { useEffect, useState } from 'react';
import {
  Flex,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
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
  Checkbox
} from '@chakra-ui/react';
import { Cluster } from '../../backend/src/cluster/entities/cluster.entity';
import { v4 as uuidv4 } from 'uuid';

interface DataItem {
  id: number;
  value: number;
}

interface AddAiProps {
  handleAddTemplateOrAI: () => Promise<void>;
}

const AddAI: React.FC<AddAiProps> = (props) => {
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
  const [plantName, setPlantName] = useState<string>('');
  const [typePlant, setTypePlant] = useState<string>('');
  const [dap, setDap] = useState<number>(10);
  const [location, setLocation] = useState<string>('');
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [clusterId, setClusterId] = useState('');
  const [clusters, setClusters] = useState<Cluster[]>([]);

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

  const ecValue = ecData.length > 0 ? ecData[0].value : 0;
  const phValue = phData.length > 0 ? phData[0].value : 0;
  const humidityValue = humidityData.length > 0 ? humidityData[0].value : 0;
  const waterTempValue = waterTempData.length > 0 ? waterTempData[0].value : 0;
  const airTempValue = airTempData.length > 0 ? airTempData[0].value : 0;
  const waterflowValue = waterflowData.length > 0 ? waterflowData[0].value : 0;

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const configEcDap = {
      ec: ecValue,
      date_start: new Date(),
      date_end: new Date(),
      dap_num: dap,
      config_ec_dap_id: uuidv4(),
      log_controller_id: uuidv4(),
    };

    const data = {
      name: plantName,
      dap_count: dap,
      location: location,
      config_ec_dap: configEcDap,
      is_active: false,
      cluster_id: clusterId,
      ec: ecValue,
      ph: phValue,
      humidity: humidityValue,
      temperature_water: waterTempValue,
      temperature_air: airTempValue,
      water_flow: waterflowValue
    };

    console.log('Submitting data:', data)

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
  }

  useEffect(() => {
    const fetchClustersAndInitializeData = async () => {
      try {
        const response = await fetch('http://localhost:4000/clusters/all');
        const data = await response.json();
        setClusters(data);
      } catch (error) {
        console.error('Error fetching clusters:', error);
      }

      const initializeData = (length: number): DataItem[] =>
        Array.from({ length }, (_, i) => ({ id: i + 1, value: 0 }));

      setEcData(initializeData(dap));
      setPhData(initializeData(dap));
      setHumidityData(initializeData(dap));
      setwaterTempData(initializeData(dap));
      setairTempData(initializeData(dap));
      setWaterflowData(initializeData(dap));
    };

    fetchClustersAndInitializeData();
  }, [dap]);

  const generateRecommendations = async () => {
    setLoading(true);
    setRecommendations(null);
    try {
      const response = await fetch('http://localhost:4000/generate-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plantName, typePlant, dap }),
      });
      const data = await response.json();

      console.log('OpenAI API Response:', data);

      if (data.recommendations) {
        const { ec, ph, humidity, temperature_air, temperature_water, water_flow } = data.recommendations;

        const initializeData = (length: number): DataItem[] =>
          Array.from({ length }, (_, i) => ({ id: i + 1, value: 0 }));

        setEcData(initializeData(dap));
        setPhData(initializeData(dap));
        setHumidityData(initializeData(dap));
        setwaterTempData(initializeData(dap));
        setairTempData(initializeData(dap));
        setWaterflowData(initializeData(dap));

        if (ec) {
          setEcData([{ id: 1, value: ec }]);
        }
        if (ph) {
          setPhData([{ id: 1, value: ph }]);
        }
        if (humidity) {
          setHumidityData([{ id: 1, value: humidity }]);
        }
        if (temperature_air) {
          setairTempData([{ id: 1, value: temperature_air }]);
        }
        if (temperature_water) {
          setwaterTempData([{ id: 1, value: temperature_water }]);
        }
        if (water_flow) {
          setWaterflowData([{ id: 1, value: water_flow }]);
        }

        setRecommendations(data.recommendations);
      } else {
        setErrorMessage('No recommendations found. Please try generating again.');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box p="4">
      <Flex direction="column" mb="6" fontSize="14px">
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
          <FormLabel fontSize="14px" fontWeight="bold">Type Plant</FormLabel>
          <Select
            placeholder="Select Type Plant"
            _placeholder={{ color: 'gray.500' }}
            size="sm"
            value={typePlant}
            onChange={(e) => setTypePlant(e.target.value)}
          >
            <option value="Sayuran">Sayuran</option>
            <option value="Buah-buahan">Buah-buahan</option>
            <option value="Biji-bijian">Biji-bijian</option>
          </Select>
        </FormControl>
        <FormControl mb="3">
          <FormLabel fontSize="14px" fontWeight="bold">Plant Name</FormLabel>
          <Input
            placeholder="Plant Name"
            _placeholder={{ color: 'gray.500' }}
            size="sm"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
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
          <FormLabel fontSize="14px" fontWeight="bold">Location Coordinate</FormLabel>
          <Input
            placeholder="Location Coordinate"
            _placeholder={{ color: 'gray.500' }}
            size="sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </FormControl>
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
                          <Button size="sm" onClick={() => handleDecrement(item.id, airTempData, setairTempData)}>-</Button>

                          <Input
                            value={item.value}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value)) {
                                setairTempData(airTempData.map(d => d.id === item.id ? { ...d, value } : d));
                              }
                            }}
                            size="sm"
                            width="40px"
                          />
                          <Button size="sm" onClick={() => handleIncrement(item.id, airTempData, setairTempData)}>+</Button>
                        </Flex>
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
                        <Flex alignItems="center">
                          <Button size="sm" onClick={() => handleDecrement(item.id, waterTempData, setwaterTempData)}>-</Button>

                          <Input
                            value={item.value}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value)) {
                                setwaterTempData(waterTempData.map(d => d.id === item.id ? { ...d, value } : d));
                              }
                            }}
                            size="sm"
                            width="40px"
                          />
                          <Button size="sm" onClick={() => handleIncrement(item.id, waterTempData, setwaterTempData)}>+</Button>
                        </Flex>
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
      <Flex justifyContent="center">
        <Button
          colorScheme="blue"
          size="sm"
          onClick={generateRecommendations}
          isLoading={loading}
        >
          Generate Template
        </Button>
        <Button colorScheme="blue" size="sm" onClick={handleSubmit} isLoading={submitLoading}>Add Template</Button>
      </Flex>
      {loading && <p>Loading...</p>}
      {errorMessage && <p>{errorMessage}</p>}
      {recommendations && (
        <div>
          <p>EC: {recommendations.ec}</p>
          <p>pH: {recommendations.ph}</p>
          <p>Humidity: {recommendations.humidity}%</p>
          <p>Air Temperature: {recommendations.temperature_air}°C</p>
          <p>Water Temperature: {recommendations.temperature_water}°C</p>
          <p>Waterflow: {recommendations.water_flow}</p>
        </div>
      )}
    </Box>
  );
};

export default AddAI;
