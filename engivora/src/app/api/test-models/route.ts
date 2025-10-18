import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Event } from '@/models/Event';
import { Message } from '@/models/Message';
import { Notification } from '@/models/Notification';
import { ActivityLog } from '@/models/ActivityLog';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get count of all models
    const [eventCount, messageCount, notificationCount, activityLogCount] = await Promise.all([
      Event.countDocuments(),
      Message.countDocuments(),
      Notification.countDocuments(),
      ActivityLog.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      message: "Database models are working correctly",
      data: {
        events: eventCount,
        messages: messageCount,
        notifications: notificationCount,
        activityLogs: activityLogCount,
      },
    });

  } catch (error) {
    console.error('Model test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Model test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}