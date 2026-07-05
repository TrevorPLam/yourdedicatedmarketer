import SampleMDX from '@/content/pages/sample.mdx';

export default function TestMDXPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">MDX Test Page</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <SampleMDX />
        </div>
      </div>
    </div>
  );
}
