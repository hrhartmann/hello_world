const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadTrade(ctx, next){
    ctx.state.trade = await ctx.orm.trade.findByPk(ctx.params.id);
    return next();
}

router.get('trades.list', '/', async (ctx) => {
    const tradesList = await ctx.orm.trade.findAll();
    await ctx.render('trades/index', {
        tradesList,
        editTradePath: (trade) => ctx.router.url('trades.edit', { id:trade.id }),
        deleteTradePath: (trade) => ctx.router.url('trades.delete', { id:trade.id }),
    });
});

router.get('trades.new', '/newTrade/:publicationId/:firstObjectId/:userId', async (ctx) => {
    const trade = ctx.orm.trade.build();
    const publicationId = ctx.params.publicationId;
    const userId = ctx.params.userId;
    const firstObjectId = ctx.params.firstObjectId;
    const productsList = await ctx.orm.product.findAll( { where: { userId:ctx.session.userId } } );
    await ctx.render('trades/new', {
        trade,
        productsList,
        submitTradePath: ctx.router.url('trades.create', {
            publicationId: publicationId,
            userId: userId,
            firstObjectId: firstObjectId }),
    });
});

router.get('trades.edit', '/:id/edit', loadTrade, async (ctx) => {
    const { trade } = ctx.state;
    await ctx.render('trades/edit', {
      trade,
      submitTradePath: ctx.router.url('trades.update', { id: trade.id }),
    });
  });

router.post('trades.create', '/:publicationId/:firstObjectId/:userId', async (ctx) => {
    const { shippingCost } = ctx.request.body;
    const { product } = ctx.request.body;
    const trade = ctx.orm.trade.build({
        shippingCost: shippingCost,
        firstUserId: ctx.params.userId,
        secondUserId: ctx.session.userId,
        publicationId: ctx.params.publicationId,
        firstObjectId: ctx.params.firstObjectId,
        secondObjectId: product,
        state: "requested",
    });
    try {
        await trade.save(
            {
                fields: [
                    'state',
                    'shippingCost',
                    'firstUserId',
                    'secondUserId',
                    'publicationId',
                    'firstObjectId',
                    'secondObjectId',
                ],
            },
        );
        ctx.redirect(ctx.router.url('trades.list'));
    } catch (validationError) {
        await ctx.render('trades/new', {
            trade,
            errors: validationError.errors,
            submitTradePath: ctx.router.url('trades.create'),
        });
    }
});

router.patch('trades.update', '/:id', loadTrade, async (ctx) => {
    const { trade } = ctx.state;
    try {
        const {
            state,
            shippingCost,
        } = ctx.request.body;
        await trade.update({
            state,
            shippingCost,
        });
        ctx.redirect(ctx.router.url('trades.list'));
    } catch (validationError) {
        await ctx.render('trades/edit', {
            trade,
            errors: validationError.errors,
            submitTradePath: ctx.router.url('trades.update'),
            
        });
    }
});

router.del('trades.delete', '/:id', loadTrade, async (ctx) => {
    const { trade } = ctx.state
    await trade.destroy();
    ctx.redirect(ctx.router.url('trades.list'))
});

module.exports = router;