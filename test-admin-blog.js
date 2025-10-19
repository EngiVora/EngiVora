// Test script for admin blog CRUD operations
// Note: This requires a valid admin token to run

const BASE_URL = 'http://localhost:3000';

// You'll need to replace this with a valid admin token from a successful admin login
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE';

async function testAdminBlogCRUD() {
  console.log('Testing Admin Blog CRUD Operations...\n');
  
  if (ADMIN_TOKEN === 'YOUR_ADMIN_TOKEN_HERE') {
    console.log('⚠️  Please replace ADMIN_TOKEN with a valid admin token to run this test\n');
    return;
  }
  
  let blogId;
  
  // Test creating a blog post
  console.log('1. Testing Blog Creation...');
  try {
    const createResponse = await fetch(`${BASE_URL}/api/admin/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify({
        title: 'Test Blog Post',
        content: 'This is a test blog post content.',
        tags: ['test', 'blog'],
        status: 'published'
      })
    });
    
    const createData = await createResponse.json();
    console.log('Create Response:', createData);
    
    if (createData.success) {
      console.log('✅ Blog creation successful\n');
      blogId = createData.data.blog_id;
      
      // Test getting all blogs
      console.log('2. Testing Get All Blogs...');
      const getAllResponse = await fetch(`${BASE_URL}/api/admin/blogs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        }
      });
      
      const getAllData = await getAllResponse.json();
      console.log('Get All Blogs Response:', getAllData);
      
      if (getAllData.success) {
        console.log('✅ Get all blogs successful\n');
        
        // Test getting the specific blog
        console.log('3. Testing Get Specific Blog...');
        const getResponse = await fetch(`${BASE_URL}/api/admin/blogs/${blogId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`
          }
        });
        
        const getData = await getResponse.json();
        console.log('Get Blog Response:', getData);
        
        if (getData.success) {
          console.log('✅ Get specific blog successful\n');
          
          // Test updating the blog
          console.log('4. Testing Blog Update...');
          const updateResponse = await fetch(`${BASE_URL}/api/admin/blogs/${blogId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${ADMIN_TOKEN}`
            },
            body: JSON.stringify({
              title: 'Updated Test Blog Post',
              content: 'This is updated test blog post content.',
              tags: ['test', 'blog', 'updated']
            })
          });
          
          const updateData = await updateResponse.json();
          console.log('Update Response:', updateData);
          
          if (updateData.success) {
            console.log('✅ Blog update successful\n');
            
            // Test deleting the blog
            console.log('5. Testing Blog Deletion...');
            const deleteResponse = await fetch(`${BASE_URL}/api/admin/blogs/${blogId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${ADMIN_TOKEN}`
              }
            });
            
            const deleteData = await deleteResponse.json();
            console.log('Delete Response:', deleteData);
            
            if (deleteData.success) {
              console.log('✅ Blog deletion successful\n');
              console.log('🎉 All admin blog CRUD operations completed successfully!');
            } else {
              console.log('❌ Blog deletion failed\n');
            }
          } else {
            console.log('❌ Blog update failed\n');
          }
        } else {
          console.log('❌ Get specific blog failed\n');
        }
      } else {
        console.log('❌ Get all blogs failed\n');
      }
    } else {
      console.log('❌ Blog creation failed\n');
    }
  } catch (error) {
    console.error('Error during admin blog CRUD test:', error);
  }
}

// Run the test
testAdminBlogCRUD();