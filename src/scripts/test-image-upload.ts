/**
 * Test script for image upload functionality
 * This script demonstrates how to test image uploads for exams, blogs, events, and jobs
 */

// Function to simulate image upload (in a real app, this would upload to a service like Cloudinary)
async function simulateImageUpload(file: File): Promise<string> {
  // In a real implementation, you would:
  // 1. Upload the file to an image hosting service
  // 2. Get back a URL for the uploaded image
  // 3. Return that URL
  
  // For testing purposes, we'll return a placeholder URL
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`https://picsum.photos/seed/${Math.random()}/400/200`);
    }, 500);
  });
}

// Test data for each content type
const testContent = {
  exam: {
    name: "Test Exam",
    description: "This is a test exam for image upload functionality",
    type: "entrance",
    category: "engineering",
    examDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    registrationStartDate: new Date().toISOString(),
    registrationEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    applicationFee: 500,
    eligibility: ["B.Tech Students"],
    syllabus: ["Topic 1", "Topic 2"],
    examCenters: ["Delhi", "Mumbai"],
    officialWebsite: "https://testexam.com",
    isActive: true,
    imageUrl: "" // Will be filled after upload
  },
  
  blog: {
    title: "Test Blog with Image",
    content: "This is a test blog post to demonstrate image upload functionality.",
    summary: "Testing image upload for blog posts",
    category: "technology",
    tags: ["test", "image"],
    featured: false,
    published: true,
    imageUrl: "" // Will be filled after upload
  },
  
  job: {
    title: "Test Job with Image",
    company: "Test Company",
    description: "This is a test job posting to demonstrate image upload functionality.",
    type: "full-time",
    category: "software",
    location: "Remote",
    remote: true,
    salary: { min: 50000, max: 80000, currency: "INR" },
    requirements: ["JavaScript", "React"],
    skills: ["JavaScript", "React", "Node.js"],
    experience: { min: 2, max: 5 },
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    applicationLink: "https://testcompany.com/apply",
    contactEmail: "careers@testcompany.com",
    isActive: true,
    featured: false,
    imageUrl: "" // Will be filled after upload
  },
  
  event: {
    title: "Test Event with Image",
    description: "This is a test event to demonstrate image upload functionality.",
    type: "Webinar",
    status: "Upcoming",
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    startTime: "14:00",
    endTime: "16:00",
    location: "Online",
    isOnline: true,
    maxAttendees: 100,
    registeredAttendees: 0,
    price: 0,
    organizer: "Test Organization",
    category: "Education",
    tags: ["test", "webinar"],
    featured: false,
    imageUrl: "", // Will be filled after upload
    requirements: "None",
    agenda: ["Introduction", "Main Content", "Q&A"]
  }
};

// Function to test creating content with image
async function testCreateContentWithImage(contentType: string, contentData: any) {
  console.log(`Testing ${contentType} creation with image...`);
  
  try {
    // Simulate image upload
    console.log("Uploading image...");
    const imageUrl = await simulateImageUpload(new File([], "test-image.jpg"));
    console.log("Image uploaded successfully:", imageUrl);
    
    // Add image URL to content data
    contentData.imageUrl = imageUrl;
    
    // In a real app, you would now send this data to your API
    console.log(`Creating ${contentType} with image...`);
    console.log("Content data:", JSON.stringify(contentData, null, 2));
    
    // Simulate API call
    console.log(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} created successfully with image!`);
    
    return {
      success: true,
      data: {
        ...contentData,
        _id: `test-${contentType}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error(`Error creating ${contentType}:`, error);
    return {
      success: false,
      error: error.message || "Unknown error"
    };
  }
}

// Run tests
async function runTests() {
  console.log("Starting image upload tests...\n");
  
  // Test each content type
  const results = [];
  
  for (const [contentType, contentData] of Object.entries(testContent)) {
    const result = await testCreateContentWithImage(contentType, { ...contentData });
    results.push({ type: contentType, result });
    console.log("\n" + "=".repeat(50) + "\n");
  }
  
  // Summary
  console.log("Test Summary:");
  console.log("=============");
  results.forEach(({ type, result }) => {
    console.log(`${type.toUpperCase()}: ${result.success ? 'PASS' : 'FAIL'}`);
    if (!result.success) {
      console.log(`  Error: ${result.error}`);
    }
  });
}

// Export for use in other modules
export {
  simulateImageUpload,
  testContent,
  testCreateContentWithImage,
  runTests
};

// Run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  runTests().catch(console.error);
}

export default runTests;