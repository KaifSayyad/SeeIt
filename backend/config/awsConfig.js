import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { PollyClient } from "@aws-sdk/client-polly";

const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const pollyClient = new PollyClient({ region: process.env.AWS_REGION });

export { dynamoDbClient, s3Client, pollyClient };
