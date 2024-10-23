import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import {GetCommand, UpdateCommand} from '@aws-sdk/lib-dynamodb';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { s3Client, pollyClient } from '../config/awsConfig.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { dynamoDbClient } from '../config/awsConfig.js';


// Initialize GoogleGenerativeAI with your API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyA6fe32hAo-5ZHTJ5tQCbAmamFz4gFlLD4'

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Upload image to S3 and process it with Gemini and Polly
const processImage = async (req, res) => {
  const file = req.file;
  // Generate unique file name
  const fileName = `${uuidv4()}-${file.originalname}`;
  const file_bin = fs.readFileSync(file.path);


  try {

    // Prepare the image data for Gemini API
    const image = {
      inlineData: {
        data: Buffer.from(file_bin).toString('base64'),
        mimeType: file.mimetype,
      },
    };

    // Use Gemini API to summarize the image
    console.log(`Prompting Gemini...`);
    const prompt = 'Describe this image and enhance the emotions comprehensively';
    const geminiResponse = await model.generateContent([prompt, image]);
    const summary = geminiResponse.response.text();
    console.log('response from gemini :\n',summary);
    // Convert the summary to speech using AWS Polly
    const pollyParams = {
      OutputFormat: 'mp3',
      Text: summary,
      VoiceId: 'Aditi',
    };

    console.log('Prompting Polly...');
    const pollyResponse = await pollyClient.send(new SynthesizeSpeechCommand(pollyParams));
    // Set response headers to handle audio streaming
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline',
      'Transfer-Encoding': 'chunked'
    });

    if (!pollyResponse.AudioStream) {
      throw new Error('No audio stream returned from Polly.');
    }
    
    // Set the appropriate headers for audio streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline');
    
    console.log('Streaming response to client');
    // Stream Polly's audio response directly to the client
    pollyResponse.AudioStream.pipe(res).on('error', (err) => {
      console.error('Error streaming audio:', err);
      res.status(500).send('Error streaming audio');
    });

  } catch (error) {
    res.status(500).json({ message: 'Error processing image', error });
  }
};

const saveImage = async (req, res) => {
  const { userId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Generate unique file name
  const fileName = `${uuidv4()}-${file.originalname}`;
  const file_bin = fs.readFileSync(file.path);

  // Upload image to S3
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file_bin,
    ACL: 'public-read',
    ContentType: file.mimetype,
  };

  try {
    console.log(`Uploading file to S3...`);
    
    await s3Client.send(new PutObjectCommand(s3Params));
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${fileName}`;

    console.log(`File uploaded to S3: ${fileUrl}`);

    // Retrieve user from DynamoDB
    const getParams = {
      TableName: process.env.DYNAMO_DB_TABLE,
      Key: { userId },
    };

    const { Item } = await dynamoDbClient.send(new GetCommand(getParams));
    
    if (!Item) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle user.memories array
    const memories = Item.memories || [];  // Initialize memories array if it doesn't exist
    memories.push(fileUrl);

    // Update user with new memories
    const updateParams = {
      TableName: process.env.DYNAMO_DB_TABLE,
      Key: { userId },
      UpdateExpression: 'SET memories = :memories',
      ExpressionAttributeValues: {
        ':memories': memories,
      },
    };

    await dynamoDbClient.send(new UpdateCommand(updateParams));
    console.log(`User ${userId} updated with new memories`);

    res.status(200).json({ message: 'Image saved and user updated successfully', fileUrl });
  } catch (error) {
    console.error('Error saving image or updating user:', error);
    res.status(500).json({ message: 'Error saving image or updating user', error });
  }
};

const getImages = async (req, res) => {
  const { userId } = req.params;
  try {
    // Retrieve user from DynamoDB
    const params = {
      TableName: process.env.DYNAMO_DB_TABLE,
      Key: { userId },
    };

    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    
    if (!Item) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the images URLs
    const memories = Item.memories || [];  // Return an empty array if memories does not exist
    res.status(200).json({ images: memories });
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ message: 'Error retrieving images', error });
  }
};

export { processImage, saveImage, getImages};