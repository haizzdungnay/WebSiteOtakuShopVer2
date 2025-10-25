export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(9)].map((_, i) => (
              <span 
                key={i} 
                className="w-3 h-3 bg-primary rounded-full animate-pulse"
              />
            ))}
          </div>
ECHO is off.
          <h1 className="text-6xl md:text-8xl font-bold text-[#8B4C6B] mb-8">
            JOIN US
          </h1>
ECHO is off.
          <p className="text-xl text-gray-600 mb-4">
            Figure Store - Anime & Manga Collectibles
          </p>
ECHO is off.
          <p className="text-sm text-gray-500">
            Setup complete Now add your components.
          </p>
        </div>
      </section>
    </main>
  )
}
