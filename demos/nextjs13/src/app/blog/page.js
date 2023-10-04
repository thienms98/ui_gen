'use client';

{/* prettier-ignore */}
import Image from 'next/image';

{/*R_IMPORT_START*/}
          import BlogSection2 from '@/components/BlogSection2'
          import BlogSection1 from '@/components/BlogSection1'
          {/*R_IMPORT_END*/}

export default function Home() {
  return (
    <>
      {/*R_CONTENT_START*/}
          <BlogSection2 />
          <BlogSection1 />
          {/*R_CONTENT_END*/}
    </>
  );
}