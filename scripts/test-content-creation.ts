import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import { Job } from '../src/models/Job';
import { Exam } from '../src/models/Exam';
import { Discount } from '../src/models/Discount';
import { connectToDatabase } from '../src/lib/db';

async function testContentCreation() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    // Test job creation
    console.log('Testing job creation...');
    const testJob = new Job({
      title: 'Software Engineer',
      company: 'Tech Corp',
      description: 'We are looking for a skilled software engineer with experience in React and Node.js. The candidate should have at least 2 years of experience in web development and be familiar with modern development practices.',
      type: 'full-time',
      category: 'software',
      location: 'Bangalore, India',
      remote: false,
      salary: {
        min: 500000,
        max: 1000000,
        currency: 'INR'
      },
      requirements: ['B.Tech in Computer Science', '2+ years experience'],
      skills: ['React', 'Node.js', 'JavaScript'],
      experience: {
        min: 2,
        max: 5
      },
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      applicationLink: 'https://techcorp.com/apply',
      contactEmail: 'careers@techcorp.com',
      isActive: true,
      featured: true
    });
    
    const savedJob = await testJob.save();
    console.log('Job created successfully:', savedJob.title);
    
    // Test exam creation
    console.log('Testing exam creation...');
    const testExam = new Exam({
      title: 'GATE 2025',
      organization: 'IIT Kanpur',
      date: new Date('2025-02-01'),
      category: 'engineering',
      description: 'Graduate Aptitude Test in Engineering for admission to postgraduate programs.',
      type: 'entrance',
      applicationFee: 1500,
      eligibility: ['B.Tech final year students', 'B.Tech graduates'],
      syllabus: ['Engineering Mathematics', 'Technical Subjects'],
      examCenters: ['Delhi', 'Mumbai', 'Bangalore'],
      officialWebsite: 'https://gate.iitk.ac.in',
      isActive: true,
      registrationStartDate: new Date('2024-09-01'),
      registrationEndDate: new Date('2024-10-01')
    });
    
    const savedExam = await testExam.save();
    console.log('Exam created successfully:', savedExam.title);
    
    // Test discount creation
    console.log('Testing discount creation...');
    const testDiscount = new Discount({
      code: 'TEST2025',
      title: 'Student Discount',
      description: 'Special discount for engineering students on online courses.',
      category: 'courses',
      discountType: 'percentage',
      discountValue: 25,
      provider: 'EduTech Learning',
      websiteUrl: 'https://edutech.com',
      imageUrl: 'https://edutech.com/discount-image.jpg',
      validFrom: new Date('2024-10-01'),
      validUntil: new Date('2024-12-31'),
      termsAndConditions: ['Valid for new users only', 'Cannot be combined with other offers'],
      eligibility: ['Engineering students', 'College students'],
      maxUsage: 1000,
      featured: true,
      active: true,
      percentage: 25,
      expiresAt: new Date('2024-12-31')
    });
    
    const savedDiscount = await testDiscount.save();
    console.log('Discount created successfully:', savedDiscount.title);
    
    console.log('All tests passed! Content creation is working correctly.');
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await mongoose.connection.close();
  }
}

testContentCreation();