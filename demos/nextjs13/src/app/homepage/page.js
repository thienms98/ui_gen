'use client'

import Image from "next/image";

{/*R_IMPORT_START*/}
          import BlogSection1 from '@/components/BlogSection1'
          import BlogSection2 from '@/components/BlogSection2'
          import BlogSection3 from '@/components/BlogSection3'
          import BlogSection4 from '@/components/BlogSection4'
          {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
          <BlogSection1 />
          <BlogSection2 />
          <BlogSection3 />
          <BlogSection4 />
          {/*R_CONTENT_END*/}
    
    </>;
}
      