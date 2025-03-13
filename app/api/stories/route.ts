// This file has been deprecated as we now fetch directly from DEV.to API
// File kept for reference in case we need to implement API route in the future

import { NextResponse } from 'next/server';
import type { DevArticle } from '../../../types';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json([]);
}