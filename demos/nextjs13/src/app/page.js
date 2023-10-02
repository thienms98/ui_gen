'use client'

import Image from "next/image";

{/*R_IMPORT_START*/}
          import BlogSection3 from '@/components/BlogSection3'
          import BlogSection5 from '@/components/BlogSection5'
          import ContentSection3 from '@/components/ContentSection3'
          {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
          <BlogSection3 />
          <BlogSection5 />
          <ContentSection3 />
          {/*R_CONTENT_END*/}
    
    </>;
}
