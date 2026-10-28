import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const toolRoot=process.env.KB_TOOLING || (fs.existsSync(path.join(root,'node_modules')) ? root : path.resolve(root,'../tooling'));
const req=createRequire(path.join(toolRoot,'package.json'));
const {build}=req('esbuild');
const {compile,preprocess}=req('svelte/compiler');
let mdsvexPath;
try { mdsvexPath=req.resolve('mdsvex'); } catch { mdsvexPath=path.join(toolRoot,'package/dist/main.js'); }
const {mdsvex}=await import(pathToFileURL(mdsvexPath));
const routes=path.join(root,'src/routes');
const pages=fs.readdirSync(routes,{recursive:true}).filter(f=>f.endsWith('+page.svx')).map(f=>path.join(routes,f));
const out=path.join(root,'rendered'); fs.mkdirSync(out,{recursive:true});
function plugin(css,mode){return {name:'kb',setup(b){
 b.onResolve({filter:/^#lib\//},args=>{let p=path.join(root,'src/lib',args.path.slice(5)); if(!path.extname(p))p+='.ts'; return {path:p};});
 b.onLoad({filter:/\.(svx|svelte|ts)$/},async args=>{
  let source=fs.readFileSync(args.path,'utf8');
  if(args.path.endsWith('locales.ts')){
   const tenants=fs.readdirSync(path.join(root,'src/lib/data/tenants')).map(f=>JSON.parse(fs.readFileSync(path.join(root,'src/lib/data/tenants',f))));
   source=source.replace(/Object.values\(import.meta.glob<Tenant>\([\s\S]*?\)\)/,JSON.stringify(tenants));
  }
  if(args.path.endsWith('KbIndex.svelte')){
   const subpages=pages.filter(p=>p!==path.join(routes,'kb/+page.svx'));
   const entries=[];
   for(const p of subpages){const res=await preprocess(fs.readFileSync(p,'utf8'),mdsvex({layout:{runbook:path.join(root,'src/lib/layouts/runbook.svelte')}}),{filename:p}); const match=res.code.match(/export const metadata = ([\s\S]*?);/); entries.push([ '/src/routes/'+path.relative(routes,p),{metadata:JSON.parse(match[1])}]);}
   source=source.replace(/import.meta.glob<\{ metadata: Meta \}>\([\s\S]*?\)/,JSON.stringify(Object.fromEntries(entries)));
  }
  if(args.path.endsWith('.ts'))return {contents:source,loader:'ts'};
  if(args.path.endsWith('.svx'))source=(await preprocess(source,mdsvex({layout:{runbook:path.join(root,'src/lib/layouts/runbook.svelte')}}),{filename:args.path})).code;
  const compiled=compile(source,{filename:args.path,generate:mode,css:'external'});
  if(compiled.css?.code) css.add(compiled.css.code);
  return {contents:compiled.js.code,loader:'js'};
 });
}};}
for(const page of pages){
 const rel=path.relative(routes,path.dirname(page)); const dest=path.join(out,rel);fs.mkdirSync(dest,{recursive:true});
 const css=new Set();
 const server=await build({stdin:{contents:`import Page from ${JSON.stringify(page)}; import {render} from 'svelte/server'; export default render(Page);`,resolveDir:toolRoot},bundle:true,write:false,format:'esm',platform:'node',nodePaths:[path.join(toolRoot,'node_modules')],plugins:[plugin(css,'server')]});
 const result=await import('data:text/javascript;base64,'+Buffer.from(server.outputFiles[0].text).toString('base64'));
 await build({stdin:{contents:`import Page from ${JSON.stringify(page)}; import {hydrate} from 'svelte'; hydrate(Page,{target:document.getElementById('app')});`,resolveDir:toolRoot},bundle:true,outfile:path.join(dest,'page.js'),format:'esm',platform:'browser',nodePaths:[path.join(toolRoot,'node_modules')],plugins:[plugin(css,'client')]});
 fs.writeFileSync(path.join(dest,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${result.default.head}<style>${[...css].join('\n')}</style></head><body><div id="app">${result.default.body}</div><script type="module" src="./page.js"></script></body></html>`);
 console.log(rel);
}
