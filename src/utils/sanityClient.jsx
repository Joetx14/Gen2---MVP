// src/utils/sanityClient.js
import { createClient } from '@sanity/client';

export default createClient({
  projectId: 'rx2zpelx', // Your Project ID from sanity.config.js
  dataset: 'content',    // Your Dataset name from sanity.config.js
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for faster loads
  apiVersion: '2023-05-03', // Use a UTC date string for API versioning (helps with consistency)
  // token: 'SANITY_API_READ_TOKEN', // Only if you have private data and enable token-based auth
});
