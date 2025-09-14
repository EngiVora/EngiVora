import { NextRequest, NextResponse } from 'next/server';

// GET all discounts
export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch discounts from your database
    // For now, we'll return mock data
    const discounts = [
      { id: '1', code: 'SUMMER23', discount: 20, type: 'percentage', validFrom: '2023-06-01', validUntil: '2023-08-31', status: 'active' },
      { id: '2', code: 'WELCOME10', discount: 10, type: 'percentage', validFrom: '2023-01-01', validUntil: '2023-12-31', status: 'active' },
      { id: '3', code: 'FLASH500', discount: 500, type: 'fixed', validFrom: '2023-09-15', validUntil: '2023-09-20', status: 'active' },
      { id: '4', code: 'WINTER24', discount: 15, type: 'percentage', validFrom: '2023-12-01', validUntil: '2024-02-28', status: 'inactive' },
      { id: '5', code: 'SPECIAL25', discount: 25, type: 'percentage', validFrom: '2023-10-01', validUntil: '2023-10-31', status: 'active' },
    ];

    return NextResponse.json(discounts);
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST a new discount
export async function POST(request: NextRequest) {
  try {
    const discountData = await request.json();

    // Validate required fields
    if (!discountData.code || !discountData.discount || !discountData.type || !discountData.validFrom || !discountData.validUntil) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate discount code format (alphanumeric)
    if (!/^[A-Z0-9]+$/.test(discountData.code)) {
      return NextResponse.json(
        { message: 'Discount code must be uppercase alphanumeric' },
        { status: 400 }
      );
    }

    // Validate discount type
    if (!['percentage', 'fixed'].includes(discountData.type)) {
      return NextResponse.json(
        { message: 'Discount type must be either percentage or fixed' },
        { status: 400 }
      );
    }

    // Validate percentage discount range (1-100)
    if (discountData.type === 'percentage' && (discountData.discount < 1 || discountData.discount > 100)) {
      return NextResponse.json(
        { message: 'Percentage discount must be between 1 and 100' },
        { status: 400 }
      );
    }

    // In a real application, you would save the discount to your database
    // For now, we'll just return the discount with a mock ID
    const newDiscount = {
      id: Date.now().toString(),
      ...discountData,
      status: discountData.status || 'active',
    };

    return NextResponse.json(newDiscount, { status: 201 });
  } catch (error) {
    console.error('Error creating discount:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}