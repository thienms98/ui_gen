'use client'

import Image from "next/image";

{/*R_IMPORT_START*/}
          import BlogSection2 from '@/components/BlogSection2'
          import ContactSection2 from '@/components/ContactSection2'
          import ContactSection1 from '@/components/ContactSection1'
          {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
          <BlogSection2 />
          <ContactSection2 />
          <ContactSection1 />
          {/*R_CONTENT_END*/}
    
    </>;
}
      