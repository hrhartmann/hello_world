const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadMessage(ctx, next){
    ctx.state.message = await ctx.orm.message.findByPk(ctx.params.id);
    return next();
}

router.get('messages.list', '/', async (ctx) => {
    const messagesList = await ctx.orm.message.findAll();
    await ctx.render('messages/index', {
        messagesList,
        newMessagePath: ctx.router.url('messages.new'),
        editMessagePath: (message) => ctx.router.url('messages.edit', { id:message.id }),
        deleteMessagePath: (message) => ctx.router.url('messages.delete', { id:message.id }),
    });
});

router.get('messages.new', '/new', async (ctx) => {
    const message = ctx.orm.message.build();
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const userList = await ctx.orm.user.findAll({ where: !{ id: user.id } } );
    await ctx.render('messages/new', {
        userProfilePath: ctx.router.url('users.show', { id:ctx.session.userId  }),
        user,
        message,
        userList,
        submitMessagePath: ctx.router.url('messages.create'),
    });
});

router.get('messages.edit', '/:id/edit', loadMessage, async (ctx) => {
    const { message } = ctx.state;
    await ctx.render('messages/edit', {
      message,
      submitMessagePath: ctx.router.url('messages.update', { id: message.id }),
    });
  });

router.post('messages.create', '/', async (ctx) => {
    const id = ctx.session.userId;
    const { content } = ctx.request.body;
    const { receiver } = ctx.request.body;
    const message = ctx.orm.message.build({
        senderUserId: id,
        content: content,
        receiverUserId: receiver,
    });
    try {
        await message.save(
            {
                fields: [
                    'senderUserId',
                    'content',
                    'receiverUserId',
                ],
            },
        );
        ctx.redirect(ctx.router.url('users.myMessagesList'));
    } catch (validationError) {
        await ctx.render('messages/new', {
            message,
            errors: validationError.errors,
            submitMessagePath: ctx.router.url('messages.create'),
        });
    }
});

router.patch('messages.update', '/:id', loadMessage, async (ctx) => {
    const { message } = ctx.state;
    try {
        const {
            content,
        } = ctx.request.body;
        await message.update({
            content,
        });
        ctx.redirect(ctx.router.url('users.myMessagesList'));
    } catch (validationError) {
        await ctx.render('messages/edit', {
            message,
            errors: validationError.errors,
            submitMessagePath: ctx.router.url('messages.update'),
            
        });
    }
});

router.del('messages.delete', '/:id', loadMessage, async (ctx) => {
    const { message } = ctx.state
    await message.destroy();
    ctx.redirect(ctx.router.url('users.myMessagesList'))
});

module.exports = router;