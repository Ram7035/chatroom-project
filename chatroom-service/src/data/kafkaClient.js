// src/data/kafkaClient.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'chatroom-service',
  brokers: [process.env.KAFKA_BROKER || 'redpanda:9092'],
});

export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({ groupId: 'chatroom-group' });

export async function connectKafka() {
    let attempts = 0;
    const maxAttempts = 10;
  
    while (attempts < maxAttempts) {
      try {
        await kafkaProducer.connect();
        await kafkaConsumer.connect();
        logger.info('✅ Connected to Kafka');
        return;
      } catch (err) {
        attempts++;
        console.warn(`❌ Kafka not ready yet (attempt ${attempts}). Retrying in 3s...`);
        await new Promise((res) => setTimeout(res, 3000));
      }
    }
  
    throw new Error('❌ Kafka connection failed after multiple retries');
}

export async function startKafkaConsumer(io) {
  await kafkaConsumer.subscribe({ topic: 'chat-messages', fromBeginning: false });

  await kafkaConsumer.run({
    eachMessage: async ({ _, message }) => {
      const data = JSON.parse(message.value.toString());
      logger.info('📥 Kafka -> Broadcasting:', data);

      if (data.chatRoomId) {
        io.to(data.chatRoomId).emit('chat:message', data);
      }
    },
  });
}

