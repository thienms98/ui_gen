const replace = require('replace-in-file');
const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const cors = require('cors');
const Replicate = require('replicate');

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
      files: `./demos/nextjs13/src/app${page === '/' ? '' : page}/page.js`,
      from: /{\/\*R_IMPORT_START(.|\r|\n)*R_IMPORT_END\*\/}/gm,
      to: `{/*R_IMPORT_START*/}
          ${importLinks.join(`
          `)}
          {/*R_IMPORT_END*/}`,
    });
    await replace({
      files: `./demos/nextjs13/src/app${page === '/' ? '' : page}/page.js`,
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
      if (fs.existsSync(pageDest)) fs.remove(pageDest);
    }
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

app.post('/template', (req, res) => {
  const { layout } = req.body;

  const component = path.join(__dirname, './resources/tailwindui', `./${layout}.js`);
  const content = fs.readFileSync(component).toString();
  let templates = content.match(/\{\/\*R_TEXT_START\*\/\}(.|\n|\r)+?\{\/\*R_TEXT_END\*\/\}/gm);
  console.log(templates.length);

  return res.json(templates.map((template) => template.slice(18, -16).trim()));
});

app.post('/generateText', async (req, res) => {
  const { prompt, sysPrompt } = req.body;
  const REPLICATE_API_TOKEN = 'r8_MWeUXsSJySX9RUbP3GyFOMDsyEkPSTM3SXxv6';
  const replicate = new Replicate({
    auth: REPLICATE_API_TOKEN,
  });

  const output = await replicate.run(
    'meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3',
    {
      input: {
        prompt,
        system_prompt: sysPrompt,
      },
    },
  );
  console.log(await output);

  return res.json(await output.join(''));
});

app.post('/updateDemo', (req, res) => {
  const { template, component } = req.body;
  if (!component) return res.status(500);
  const destComponent = path.join(__dirname, `./demos/nextjs13/src/app/_components/${component}.js`);

  let content = fs.readFileSync(destComponent).toString();
  const matchWords = content.match(/\{\/\*R_TEXT_START\*\/\}(.|\n|\r)+?\{\/\*R_TEXT_END\*\/\}/gm);
  template.forEach((t, index) => {
    content = content.replace(
      matchWords[index],
      `{/*R_TEXT_START*/}
      ${template[index].slice(8, -3)}
    {/*R_TEXT_END*/}`,
    );
  });
  console.log(content);
  fs.writeFileSync(destComponent, content);

  return res.status(200);
});

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
