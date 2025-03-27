import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'chatroom-service',
  brokers: [process.env.KAFKA_BROKER || 'redpanda:9092'],
});

export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({ groupId: 'chatroom-group' });

