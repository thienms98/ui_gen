'use client';

{/* prettier-ignore */}
import Image from 'next/image';

{/*R_IMPORT_START*/}
          import BlogSection2 from '@/components/BlogSection2'
          import BlogSection3 from '@/components/BlogSection3'
          import BlogSection6 from '@/components/BlogSection6'
          {/*R_IMPORT_END*/}

export default function Home() {
  return (
    <>
      {/*R_CONTENT_START*/}
          <BlogSection2 />
          <BlogSection3 />
          <BlogSection6 />
          {/*R_CONTENT_END*/}
    </>
  );
}