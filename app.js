const koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const render = require('koa-art-template');
const path = require('path');
const data = require('./data/data01');
const app = new koa();
const router = new Router();

router.get('/',async(context) => {
  context.render('index',{
    imageArr: data.imageArr,
    imageArr1: data.imageArr1,
    imageArr2: data.imageArr2,
    imageUrl: data.imageUrl,
    imageBottom: data.imageBottom,
    imageUrl1: data.imageUrl1,
    boxImage: data.imageUrl2,
    imageUrl3: data.imageUrl3,
    imageUrl4: data.imageUrl4,
    dataTitle: data.dataTitle,
    imageUrl5: data.imageUrl5,
    dataTitle1: data.dataTitle1,
    dataTitle2: data.dataTitle2,
    dataTitle3: data.dataTitle3
  });
}).get('/GueesYouLinkIt',async(context) => {
  // 返回你喜欢的数据
  context.body = data.guessYouLinkIt;
}).get('/intelligentPioneer',async(context) => {
  context.body = data.intelligentPioneer;
}).get('/homeQualityProducts',async(context) => {
  context.body = data.homeQualityProducts;
}).get('/fashionInsider',async(context) => {
  context.body = data.fashionInsider;
}).get('/shopping',async(context) => {
  context.body = data.shopping;
}).get('/ImportedGoods',async(context) => {
  context.body = data.ImportedGoods;
});
render(app,{
    root: path.join(__dirname, 'html'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

app.use(router.routes()).use(router.allowedMethods());
app.use(static('./static/'));
app.listen(4000,() => {
  console.log('ruing 4000');
});