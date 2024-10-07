import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDbClient } from '../config/awsConfig.js';
import { v4 as uuidv4 } from 'uuid';


const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  const scanParams = {
    TableName: process.env.DYNAMO_DB_TABLE,
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
        ':email': email,
    },
};

  try {
    const { Items } = await dynamoDbClient.send(new ScanCommand(scanParams));
    
    if (!Items || Items.length == 0 || Items.length > 1) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, Items[0].passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ email: Items[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,  // Prevent access from JavaScript
      secure: false, 
      sameSite: 'Lax', // Restrict cross-site requests
      maxAge: 3600000  // Cookie expiration in milliseconds
    });

    // Send response with userId
    return res.status(200).json({ userId: Items[0].userId, message: 'User authenticated successfully' });
    
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating user', error });
  }
};

const addUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = uuidv4() + new Date().getTime();

  const scanParams = {
      TableName: process.env.DYNAMO_DB_TABLE,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
          ':email': email,
      },
  };

  try {
      const { Items } = await dynamoDbClient.send(new ScanCommand(scanParams));

      if (Items && Items.length > 0) {
          return res.status(400).json({ message: 'User already exists' });
      }

      if (!password) {
          return res.status(400).json({ message: 'Password is required' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = {
          userId,
          email,
          name,
          passwordHash,
      };

      const putParams = {
          TableName: process.env.DYNAMO_DB_TABLE,
          Item: newUser,
      };

      await dynamoDbClient.send(new PutCommand(putParams));

      const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, {
        httpOnly: true,  // Prevent access from JavaScript
        secure: false, 
        sameSite: 'Lax', // Restrict cross-site requests
        maxAge: 3600000  // Cookie expiration in milliseconds
      });

      // Send response with userId
      return res.status(201).json({ userId: newUser.userId, message: 'User registered successfully' });

  } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
  }
};

export { authenticateUser, addUser };