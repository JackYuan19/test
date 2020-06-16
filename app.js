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
    imageBottom: data.imageBottom
  });
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