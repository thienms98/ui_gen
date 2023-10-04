'use client';

{/* prettier-ignore */}
import Image from 'next/image';

{/*R_IMPORT_START*/}
          import ContentSection3 from '@/components/ContentSection3'
          import BlogSection2 from '@/components/BlogSection2'
          {/*R_IMPORT_END*/}

export default function Home() {
  return (
    <>
      {/*R_CONTENT_START*/}
          <ContentSection3 />
          <BlogSection2 />
          {/*R_CONTENT_END*/}
    </>
  );
}