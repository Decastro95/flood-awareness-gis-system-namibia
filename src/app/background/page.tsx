import OptimizedImage from '@/components/OptimizedImage';

export default function Background() {
  return (
    <main className="container mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Project Background & Historical Context</h1>

      <OptimizedImage
        src="/pdna-2009-cover.jpg"
        alt="2009 Post-Disaster Needs Assessment (PDNA) – Government of Namibia"
      />

      <OptimizedImage
        src="/dref-floods-cover.png"
        alt="IFRC DREF Operation 2009 – Flooded household in Ohangwena Region"
      />

      <OptimizedImage
        src="/regions-constituencies.png"
        alt="Namibia Regional Councils, Municipalities, and Constituencies"
        width={1000}
        height={800}
      />

      <OptimizedImage
        src="/thesis-cover.png"
        alt="2011 Floods Impact Study – Oshoopala Informal Settlement, Oshakati"
      />

      <p className="text-lg mt-8">
        This platform builds on lessons from major floods in 2009 and 2011, 
        emphasizing community involvement in disaster management as recommended 
        in the 2009 PDNA and academic research.
      </p>
    </main>
  );
}
