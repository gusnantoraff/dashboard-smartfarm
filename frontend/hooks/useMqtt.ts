import { MqttClient } from 'mqtt';
import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

require('dotenv').config();

const host = process.env.NEXT_PUBLIC_MQTT_HOST as string;
const user = process.env.NEXT_PUBLIC_MQTT_USER as string;
const password = process.env.NEXT_PUBLIC_MQTT_PASSWORD as string;
const topic = process.env.NEXT_PUBLIC_MQTT_TOPIC as string;

function useMqtt() {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [status, setStatus] = useState<'offline' | 'connecting' | 'connected'>(
    'connecting',
  );
  const [loading, setLoading] = useState(true);
  const [firstConnect, setFirstConnect] = useState(true);

  useEffect(() => {
    const mqttClient = mqtt.connect(`wss://${host}/mqtt`, {
      clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
      clean: true,
      connectTimeout: 60000,
      username: user,
      password: password,
    });

    setClient(mqttClient);
  }, []);

  useEffect(() => {
    if (client && firstConnect) {
      client.on('connect', () => {
        console.log('Connected to broker');
        setStatus('connected');
        client.subscribe(topic, (err) => {
          if (err) {
            console.error('Subscription error:', err);
          } else {
            console.log('Subscribed to topic:', topic);
          }
        });
        setLoading(false);
      });

      client.on('reconnect', () => {
        setStatus('connecting');
      });

      client.on('offline', () => {
        setStatus('offline');
      });

      setFirstConnect(false);
    }

    // Cleanup on unmount
    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client]);

  return { mqtt: client, status, loading, setStatus };
}

export default useMqtt;
