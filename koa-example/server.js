const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const apiPrefix = '/api/v0';
const apiRouter = new Router({prefix: apiPrefix});

let message = 'Hello world';

app.use(bodyParser());

app.on('error', (err, ctx) => {
    logger.warn({err, ctx});
});

app.use(
    apiRouter.routes(),
    apiRouter.allowedMethods(),
);

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.type = 'application/json';
        ctx.body = err;

        ctx.app.emit('error', err, ctx);
    }
});

apiRouter
    .get('/', async ctx => {
        ctx.status = 200;
        ctx.type = 'application/json';
        ctx.body = {message};
    })
    .put('/', async ctx => {
        message = ctx.request.body.message || message;
        ctx.status = 201;
        ctx.type = 'application/json';
        ctx.body = {message};
    });

app.listen(3000);
