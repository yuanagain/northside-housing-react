#!/usr/bin/env node

/**
 * Integration tests for Northside Housing Explorer
 * Tests both the React frontend and Flask backend
 */

const http = require('http');
const https = require('https');

// Test configuration
const BACKEND_URL = 'http://localhost:8080';
const FRONTEND_URL = "http://localhost:3003"

console.log('🧪 Starting Northside Housing Explorer Integration Tests\n');

// Helper function to make HTTP requests
function makeRequest(url, isHttps = true) {
  const client = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = res.headers['content-type']?.includes('application/json')
            ? JSON.parse(data)
            : data;
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (error) {
          resolve({ status: res.statusCode, data, headers: res.headers, parseError: error.message });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  const tests = [
    {
      name: 'Backend: Hospital List API',
      url: `${BACKEND_URL}/api/hospitals`,
      validate: (result) => {
        if (result.status !== 200) return `Expected 200, got ${result.status}`;
        if (!Array.isArray(result.data)) return 'Expected array of hospitals';
        if (result.data.length !== 6) return `Expected 6 hospitals, got ${result.data.length}`;

        const gwinnett = result.data.find(h => h.name === 'Northside Hospital Gwinnett');
        if (!gwinnett) return 'Gwinnett hospital not found';

        return null; // Pass
      }
    },
    {
      name: 'Backend: Gwinnett Properties API',
      url: `${BACKEND_URL}/api/hospitals/northside_hospital_gwinnett/properties`,
      validate: (result) => {
        if (result.status !== 200) return `Expected 200, got ${result.status}`;
        if (!result.data.properties) return 'No properties field found';
        if (!Array.isArray(result.data.properties)) return 'Properties should be array';
        if (result.data.properties.length === 0) return 'No properties found for Gwinnett';
        if (result.data.properties.length < 20) return `Expected 20+ properties, got ${result.data.properties.length}`;

        // Check property structure
        const firstProp = result.data.properties[0];
        const requiredFields = ['property_name', 'address', 'lat', 'lng', 'driving_duration_minutes'];
        for (const field of requiredFields) {
          if (!(field in firstProp)) return `Missing required field: ${field}`;
        }

        return null; // Pass
      }
    },
    {
      name: 'Backend: CORS Headers',
      url: `${BACKEND_URL}/api/hospitals`,
      validate: (result) => {
        const corsHeader = result.headers['access-control-allow-origin'];
        if (!corsHeader) return 'No CORS header found';
        return null; // Pass
      }
    },
    {
      name: 'Frontend: Homepage Access',
      url: FRONTEND_URL,
      isHttps: false,
      validate: (result) => {
        if (result.status !== 200) return `Expected 200, got ${result.status}`;
        if (typeof result.data !== 'string') return 'Expected HTML string';
        if (!result.data.includes('Hospital Housing') && !result.data.includes('Hospital Housing Directory')) {
          return 'Hospital housing content not found (page may be loading)';
        }
        return null; // Pass
      }
    },
    {
      name: 'Frontend: Maps API Key Endpoint',
      url: `${FRONTEND_URL}/api/maps-key`,
      isHttps: false,
      validate: (result) => {
        if (result.status !== 200) return `Expected 200, got ${result.status}`;
        if (!result.data.apiKey) return 'No API key returned';
        if (!result.data.apiKey.startsWith('AIzaSy')) return 'Invalid API key format';
        return null; // Pass
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    process.stdout.write(`${test.name}... `);

    try {
      const result = await makeRequest(test.url, test.isHttps !== false);
      const error = test.validate(result);

      if (error) {
        console.log(`❌ FAIL: ${error}`);
        failed++;
      } else {
        console.log(`✅ PASS`);
        passed++;
      }
    } catch (error) {
      console.log(`❌ FAIL: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log(`\n🎉 All tests passed! The application is working correctly.`);
    process.exit(0);
  } else {
    console.log(`\n⚠️  Some tests failed. Please check the issues above.`);
    process.exit(1);
  }
}

runTests().catch(console.error);