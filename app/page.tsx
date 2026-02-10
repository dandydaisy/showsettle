import { Calculator } from '@/components/Calculator'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            ShowSettle
          </h1>
          <p className="text-xl text-slate-600">
            Settle shows in 30 seconds
          </p>
        </div>

        <Calculator />

        <div className="mt-12 text-center text-sm text-slate-500">
          <p>Built by AI · Guided by you</p>
        </div>
      </div>
    </main>
  )
}
