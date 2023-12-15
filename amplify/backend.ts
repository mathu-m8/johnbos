// amplify/backend.ts
import * as s3 from 'aws-cdk-lib/aws-s3';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';

const backend = defineBackend({
  auth,
  data,
  storage
});