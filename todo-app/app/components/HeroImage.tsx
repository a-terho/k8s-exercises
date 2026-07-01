import Image from 'next/image';
import { loadImage } from '@/app/util/imageCache';

export const dynamic = 'force-dynamic';

const HeroImage = async () => {
  const { timestamp } = await loadImage();

  // loading src with img timestamp makes sure that
  // Next.js' image optimizer does not keep loading
  // cached stale image if the timestamp has changed
  const src = `/api/images/hero?t=${timestamp}`;

  return (
    <Image
      src={src}
      alt="Hero image"
      width={400}
      height={400}
      loading="eager"
      className="rounded-lg"
    />
  );
};

export default HeroImage;
