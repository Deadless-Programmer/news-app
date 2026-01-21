// app/api/news/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'us';
  const category = searchParams.get('category') || '';

  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: 'Server configuration error: News API key is missing' },
      { status: 500 }
    );
  }

  const categoryParam = category ? `&category=${category}` : '';
  const url = `https://newsapi.org/v2/top-headlines?country=${country}${categoryParam}&pageSize=12&apiKey=${apiKey}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || `NewsAPI responded with status ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('News API fetch failed:', error);
    return NextResponse.json(
      { message: 'Failed to fetch news - internal server error' },
      { status: 500 }
    );
  }
}