import { config } from 'dotenv';
import { resolve } from 'path';

type LoginResponse = {
  user: {
    email: string;
    name: string;
    role: string;
  };
  expires: string;
};

type ContentResponse = {
  _id: string;
  seo: {
    focusKeywords: string[];
  };
};

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function testFocusKeywords() {
  try {
    const axios = (await import('axios')).default;

    // Login request using NextAuth endpoint
    console.log('\n1. Testing authentication...');
    // Get CSRF token first
    const csrfResponse = await axios.get(`${BASE_URL}/api/auth/csrf`);
    const { csrfToken } = csrfResponse.data;

    // Perform login with CSRF token
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/signin/credentials`, {
      email: 'admin@seocms.com',
      password: 'Admin@123',
      csrfToken,
      callbackUrl: `${BASE_URL}/dashboard`,
      json: true
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `next-auth.csrf-token=${csrfToken}`
      },
      withCredentials: true,
      maxRedirects: 5
    });

    if (!loginResponse.data || !loginResponse.data.user) {
      throw new Error('Authentication failed: Invalid response received');
    }

    const sessionData = loginResponse.data as LoginResponse;
    console.log('✓ Authentication successful');

    // Test content creation with focus keywords
    console.log('\n2. Testing content creation with focus keywords...');
    const testContent = {
      title: 'Test Focus Keywords Article',
      description: 'A test article to verify focus keywords functionality',
      slug: 'test-focus-keywords',
      content: '<p>This is a test article that contains multiple focus keywords. We are testing SEO optimization and keyword functionality.</p>',
      categories: ['test', 'seo'],
      seo: {
        title: 'Test Focus Keywords | SEO Testing',
        description: 'Comprehensive test of SEO focus keywords functionality with multiple target phrases',
        focusKeywords: ['seo testing', 'focus keywords', 'keyword optimization'],
        metaRobots: 'index,follow'
      },
      status: 'draft',
      author: {
        email: 'admin@seocms.com',
        firstName: 'Admin',
        lastName: 'User'
      }
    };

    const contentResponse = await axios.post(`${BASE_URL}/api/seo/content`, 
      testContent,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    const content = contentResponse.data as ContentResponse;
    console.log('✓ Content created successfully');
    console.log('✓ Focus keywords stored:', content.seo.focusKeywords);

    // Verify focus keywords
    const keywordsMatch = JSON.stringify(content.seo.focusKeywords) === 
                         JSON.stringify(testContent.seo.focusKeywords);
    
    if (keywordsMatch) {
      console.log('\n✓ Focus keywords test passed - Keywords stored correctly');
    } else {
      throw new Error('Focus keywords mismatch - Test failed');
    }

    // Test content retrieval
    console.log('\n3. Testing content retrieval...');
    const retrieveResponse = await axios.get(`${BASE_URL}/api/seo/content/${content._id}`, {
      withCredentials: true
    });

    const retrievedContent = retrieveResponse.data;
    console.log('✓ Content retrieved successfully');
    console.log('✓ Retrieved focus keywords:', retrievedContent.seo.focusKeywords);

    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testFocusKeywords();