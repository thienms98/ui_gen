'use client'

import Image from "next/image";

{/*R_IMPORT_START*/}
            import ContactSection2 from '@/components/ContactSection2'
            import ContactSection3 from '@/components/ContactSection3'
            {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
            <ContactSection2 />
            <ContactSection3 />
            {/*R_CONTENT_END*/}
    
    </>;
}