'use client'

import Image from "next/image";

{/*R_IMPORT_START*/}
            import ContactSection2 from '@/components/ContactSection2'
            import ContactSection3 from '@/components/ContactSection3'
            import BlogSection3 from '@/components/BlogSection3'
            import BlogSection4 from '@/components/BlogSection4'
            {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
            <ContactSection2 />
            <ContactSection3 />
            <BlogSection3 />
            <BlogSection4 />
            {/*R_CONTENT_END*/}
    
    </>;
}