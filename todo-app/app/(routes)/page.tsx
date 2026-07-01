import type { Metadata } from 'next';
import HeroImage from '@/app/components/HeroImage';

export const metadata: Metadata = {
  title: 'Index',
};

const IndexPage = async () => {
  return (
    <div className="flex flex-col items-center">
      <HeroImage />
      <p className="mbs-4 text-xl">DevOps with Kubernetes 2026</p>
    </div>
  );
};

export default IndexPage;
