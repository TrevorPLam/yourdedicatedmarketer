export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Your Dedicated Marketer
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional marketing services to grow your business
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
          Get Started
        </button>
      </div>
    </main>
  );
}
