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
  const { page, layouts } = req.body;

  const appFolder = path.join(__dirname, './demos/nextjs13/src/app');
  const destComponentsFolder = path.join(appFolder, './_components');
  const resourcesFolder = path.join(__dirname, './resources');
  const resourcePath = path.join(resourcesFolder, 'tailwindui');

  try {
    // read layouts.json file
    const allLayouts = JSON.parse(fs.readFileSync(path.join(__dirname, './layouts.json')).toString());
    const index = allLayouts.findIndex(({ page: pageName }) => pageName === page);
    // overwrite json file while generate new page
    if (index === -1) allLayouts.push({ page, layouts });
    else allLayouts.splice(index, 1, { page, layouts });
    fs.writeFileSync(path.join(__dirname, './layouts.json'), JSON.stringify(allLayouts));

    // unless folder exist, create one
    const newPageFolder = path.join(appFolder, page);
    if (!fs.existsSync(newPageFolder)) {
      fs.mkdirSync(newPageFolder);
      // create page.js following template
      fs.copyFileSync(path.join(resourcesFolder, './pageTemplate.js'), path.join(appFolder, page, '/page.js'));
    }

    await fs.remove(destComponentsFolder);

    const importLinks = [];
    const components = [];

    // copy needed components to _components fodlder
    const componentsNeeded = [];
    allLayouts.forEach(({ layouts }) => {
      layouts.map((layout) => {
        if (!componentsNeeded.includes(layout)) {
          componentsNeeded.push(layout);
          const sourceFilePath = path.join(resourcePath, `${layout}.js`);
          const destinationPath = path.join(destComponentsFolder, `${layout}.js`);

          fs.copy(sourceFilePath, destinationPath);
        }
      });
    });

    // generate file links
    layouts.forEach((section) => {
      const importUrl = `import ${section} from '@/components/${section}'`;

      importLinks.includes(importUrl) ? null : importLinks.push(importUrl);
      components.push(`<${section} />`);
    });

    await replace({
      files: `./demos/nextjs13/src/app${page}/page.js`,
      from: /{\/\*R_IMPORT_START(.|\r|\n)*R_IMPORT_END\*\/}/gm,
      to: `{/*R_IMPORT_START*/}
          ${importLinks.join(`
          `)}
          {/*R_IMPORT_END*/}`,
    });
    await replace({
      files: `./demos/nextjs13/src/app${page}/page.js`,
      from: /{\/\*R_CONTENT_START(.|\r|\n)*R_CONTENT_END\*\/}/gm,
      to: `{/*R_CONTENT_START*/}
        ${components.join(`
        `)}
        {/*R_CONTENT_END*/}`,
    });
    console.log('✔ done 😎');
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

app.get('/pages', (req, res) => {
  const pages = fs.readFileSync(path.join(__dirname, './layouts.json')).toString();

  return res.json({ pages: JSON.parse(pages) });
});

app.delete('/pages', (req, res) => {
  try {
    const page = req.body.page;

    // read json file
    const jsonDir = path.join(__dirname, './layouts.json');
    const allLayouts = JSON.parse(fs.readFileSync(jsonDir).toString());
    // remove page from json file
    const layouts = allLayouts.filter((layout) => layout.page !== page);
    fs.writeFileSync(jsonDir, JSON.stringify(layouts));
    if (page === '/')
      fs.copy(
        path.join(__dirname, './resources/pageTemplate.js'),
        path.join(__dirname, './demos/nextjs13/src/app/page.js'),
      );
    else {
      const pageDest = path.join(__dirname, './demos/nextjs13/src/app', page);
      if (fs.existsSync(pageDest)) fs.removeSync(pageDest);
    }
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
