const replace = require('replace-in-file');
const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const cors = require('cors');

const resourceParentPath = path.join(__dirname, './resources');
const resourcePath = path.join(resourceParentPath, 'tailwindui');
const app = express();
const port = 3232;

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use('/assets', express.static('resources'));

app.get('/layout/:name', async (req, res, next) => {
  try {
    const name = req.params.name;
    const html = fs.readFileSync(path.join(resourcePath, `preview/${name}.html`));
    res.json({ html: html.toString() });
  } catch (error) {
    res.status(500);
  }
});

app.get('/layouts', async (req, res, next) => {
  const files = fs.readdirSync(resourcePath);
  const filteredFiles = files.map((f) => f.replace('.js', ''));
  res.json({
    tailwindLayouts: filteredFiles,
  });
});

app.post('/generate', async (req, res, next) => {
  const body = req.body;

  /* request: 
  {
    page: string
    layouts: string[]
  }[]

  =>  tạo các folder/page.js theo các page[], writeFile bằng template tương tự page.js ban đầu;
  =>  lặp qua từng page,
      generate các component nằm tromg layouts tương ứng với các folder/page.js

  ** xoá các folder(page) không có trong body
  ** mỗi khi xoá component cũ của từng page => component cho các page khác bị xoá mất => error
  */

  try {
    // lấy layouts từ request
    await body.forEach(async ({ layouts, page }) => {
      // const layouts = body.layouts;

      const pageDest = path.join(__dirname, './demos/nextjs13/src/app/', page);
      if (!fs.existsSync(pageDest)) {
        fs.mkdirSync(pageDest);
      }
      const layoutPageDest = path.join(pageDest, 'page.js');
      if (!fs.existsSync(layoutPageDest)) {
        fs.createFileSync(layoutPageDest);
        fs.writeFileSync(
          layoutPageDest,
          `'use client'

import Image from "next/image";

{/*R_IMPORT_START*/}
          {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
          {/*R_CONTENT_END*/}
    
    </>;
}`,
        );
      }
      // folder đích đến _components
      const destParentFolder = path.join(__dirname, './demos/nextjs13/src/app/_components');
      // thư mục chứa components dựng sẵn
      const resourceParentPath = path.join(__dirname, './resources');
      const resourcePath = path.join(resourceParentPath, 'tailwindui');

      // xoá folder chứa components cũ
      await fs.remove(destParentFolder);

      // xoá các page folder không dùng đến
      // console.log(path.join(__dirname, './demos/nextjs13/sec/app'));
      // const folders = fs.readdirSync(path.join(__dirname, './demos/nextjs13/sec/app'));
      // console.log(folders);

      const importLinks = [];
      const components = [];

      let componentsNeeded = [];
      body.forEach(({ layouts }) => {
        componentsNeeded.push(...layouts);
      });
      console.log(componentsNeeded);
      [...new Set(componentsNeeded)].forEach(async (component) => {
        // lấy component được gọi từ layouts trong resources => copy vào thư mục đích
        const sourceFilePath = path.join(resourcePath, `${component}.js`);
        const destinationPath = path.join(destParentFolder, `${component}.js`);

        await fs.copy(sourceFilePath, destinationPath);
      });

      // generate file links
      layouts.forEach((section) => {
        // // lấy component được gọi từ layouts trong resources => copy vào thư mục đích
        // const sourceFilePath = path.join(resourcePath, `${section}.js`);
        // const destinationPath = path.join(destParentFolder, `${section}.js`);

        // fs.copy(sourceFilePath, destinationPath);

        // tạo chuỗi import
        const importUrl = `import ${section} from '@/components/${section}'`;
        importLinks.includes(importUrl) ? null : importLinks.push(importUrl);
        // tạo chuỗi gọi component
        components.push(`<${section} />`);
      });

      console.log(components);
      console.log(importLinks);

      // import các components
      await replace({
        files: `./demos/nextjs13/src/app${page}/page.js`,
        from: /{\/\*R_IMPORT_START(.|\r|\n)*R_IMPORT_END\*\/}/gm,
        to: `{/*R_IMPORT_START*/}
            ${importLinks.join(`
            `)}
            {/*R_IMPORT_END*/}`,
      });

      // gọi các components
      await replace({
        files: `./demos/nextjs13/src/app${page}/page.js`,
        from: /{\/\*R_CONTENT_START(.|\r|\n)*R_CONTENT_END\*\/}/gm,
        to: `{/*R_CONTENT_START*/}
            ${components.join(`
            `)}
            {/*R_CONTENT_END*/}`,
      });
    });

    res.json({
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
