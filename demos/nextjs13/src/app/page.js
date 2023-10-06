'use client';

{/* prettier-ignore */}
import Image from 'next/image';

{/*R_IMPORT_START*/}
          import BlogSection2 from '@/components/BlogSection2'
          import BlogSection4 from '@/components/BlogSection4'
          import ContactSection1 from '@/components/ContactSection1'
          {/*R_IMPORT_END*/}

export default function Home() {
  return (
    <>
      {/*R_CONTENT_START*/}
        <BlogSection2 />
        <BlogSection4 />
        <ContactSection1 />
        {/*R_CONTENT_END*/}
    </>
  );
}