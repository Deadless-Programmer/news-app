'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { countries } from '@/data/countries'
import { categories } from '@/data/categories'
import CategorySelector from '@/components/CategorySelector'  

export default function Home() {
  const searchParams = useSearchParams()
  const selectedCountry = searchParams.get('country') || 'us'
  const selectedCategory = searchParams.get('category') || ''

  const [articles, setArticles] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      setArticles([])

      try {
        const categoryParam = selectedCategory ? `&category=${selectedCategory}` : ''
        const url = `https://newsapi.org/v2/top-headlines?country=${selectedCountry}${categoryParam}&pageSize=12&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`

        console.log('Fetching from:', url)

        const res = await fetch(url, {
          cache: 'no-store',  
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(`NewsAPI error: ${res.status} - ${errData.message || 'Unknown error'}`)
        }

        const data = await res.json()
        console.log('API Response:', {
          totalResults: data.totalResults,
          articlesCount: data.articles?.length || 0,
          country: selectedCountry,
          category: selectedCategory || 'general',
        })

        setArticles(data.articles || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load news. Check connection or API key.')
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [selectedCountry, selectedCategory]) 

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-10 text-gray-900">
          Top Headlines by Country
        </h1>

        {/* Country Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Choose a Country
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-4">
            {countries.map((country) => (
              <a
                key={country.code}
                href={`/?country=${country.code}`}
                className={`flex flex-col items-center p-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer
                  ${selectedCountry === country.code
                    ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-105'}`}
              >
                <span className="text-4xl mb-2">{country.flag}</span>
                <span className="text-sm font-medium">{country.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Category */}
        <section className="mb-10 text-center">
          <CategorySelector />
        </section>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Loading headlines...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* News Grid */}
        {!loading && articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <a
                key={`${article.url || index}-${index}`}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-all flex flex-col h-full border border-gray-200 group"
              >
                <div className="relative h-48 w-full">
                  {article.urlToImage ? (
                    <Image
                      src={article.urlToImage}
                      alt={article.title || "News image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3}
                    />
                  ) : (
                    <div className="h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 w-fit ${
                      selectedCategory
                        ? categories.find((c) => c.code === selectedCategory)?.color || 'bg-gray-200 text-gray-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {selectedCategory
                      ? categories.find((c) => c.code === selectedCategory)?.name
                      : 'General'}
                  </span>

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-700">
                    {article.title || 'No title'}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                    {article.description || 'No description available.'}
                  </p>

                  <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                    <span className="font-medium text-blue-600">
                      {article.source?.name || 'Source'}
                    </span>
                    <time suppressHydrationWarning>
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <div className="text-center py-20 text-gray-600">
              <h3 className="text-2xl font-medium mb-4">No headlines available</h3>
              <p>
                No top stories found for {countries.find((c) => c.code === selectedCountry)?.name || selectedCountry.toUpperCase()}
                {selectedCategory ? ` in ${selectedCategory}` : ''}.
              </p>
              <p className="mt-2">Try another country or category.</p>
            </div>
          )
        )}
      </div>
    </main>
  )
}