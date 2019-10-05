const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadUser(ctx, next){
    ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
    return next();
}

router.get('users.list', '/', async (ctx) => {
    const usersList = await ctx.orm.user.findAll();
    await ctx.render('users/index', {
        usersList,
        newUserPath: ctx.router.url('users.new'),
        publicationsListPath: ctx.router.url('publications.list'),
        productsListPath: ctx.router.url('products.list'),
        showUserPath: (user) => ctx.router.url('users.show', { id:user.id }),
        editUserPath: (user) => ctx.router.url('users.edit', { id:user.id }),
        deleteUserPath: (user) => ctx.router.url('users.delete', { id:user.id }),
    });
});

router.get('users.new', '/new', async (ctx) => {
    const user = ctx.orm.user.build();
    await ctx.render('users/new', {
        user,
        submitUserPath: ctx.router.url('users.create'),
    });
});

router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
    const { user } = ctx.state;
    await ctx.render('users/edit', {
      user,
      submitUserPath: ctx.router.url('users.update', { id: user.id }),
    });
  });

router.post('users.create', '/', async (ctx) => {
    const user = ctx.orm.user.build(ctx.request.body);
    try {
        await user.save(
            {
                fields: [
                    'name',
                    'username',
                    'password',
                    'email',
                    'adress',
                    'phoneNumber',
                ],
            },
        );
        ctx.redirect(ctx.router.url('users.list'));
    } catch (validationError) {
        await ctx.render('users/new', {
            user,
            errors: validationError.errors,
            submitUserPath: ctx.router.url('users.create'),
        });
    }
});

router.patch('users.update', '/:id', loadUser, async (ctx) => {
    const { user } = ctx.state;
    try {
        const {
            name,
            username,
            password,
            email,
            adress,
            phoneNumber,
        } = ctx.request.body;
        await user.update({
            name,
            username,
            password,
            email,
            adress,
            phoneNumber,
        });
        ctx.redirect(ctx.router.url('users.list'));
    } catch (validationError) {
        await ctx.render('users/edit', {
            user,
            errors: validationError.errors,
            submitUserPath: ctx.router.url('users.update'),

        });
    }
});

router.del('users.delete', '/:id', loadUser, async (ctx) => {
    const { user } = ctx.state
    await user.destroy();
    ctx.redirect(ctx.router.url('users.list'))
});

router.get('users.show', '/:id/show', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.params.id);
    await ctx.render('users/show', {
        user,
        productsListPath: ctx.router.url('products.list'),
        publicationsListPath: ctx.router.url('users.publicationsList', { id:user.id } ),
        editUserPath: (user) => ctx.router.url('users.edit', { id:user.id }),
        deleteUserPath: (user) => ctx.router.url('users.delete', { id:user.id }),
    });
});

router.get('users.publicationsList', '/:id/publicationsList', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.params.id);
    const publicationsList = await ctx.orm.publication.findAll( { where: { userId:user.id } } );
    await ctx.render('users/publicationsList', {
        user,
        publicationsList,
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        editPublicationPath: (publication) => ctx.router.url('publications.edit', { id:publication.id }),
        showPublicationPath: (publication) => ctx.router.url('publications.show', { id:publication.id }),
        deletePublicationPath: (publication) => ctx.router.url('publications.delete', { id:publication.id }),
    });
});

router.get('users.myPublicationsList', '/myPublicationsList', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const publicationsList = await ctx.orm.publication.findAll( { where: { userId:user.id } } );
    await ctx.render('users/publicationsList', {
        user,
        publicationsList,
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        editPublicationPath: (publication) => ctx.router.url('publications.edit', { id:publication.id }),
        showPublicationPath: (publication) => ctx.router.url('publications.show', { id:publication.id }),
        deletePublicationPath: (publication) => ctx.router.url('publications.delete', { id:publication.id }),
    });
});

router.get('users.myProductsList', '/myProductsList', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const productsList = await ctx.orm.product.findAll( { where: { userId:user.id } } );
    const categoriesList = await ctx.orm.category.findAll();
    await ctx.render('users/productsList', {
        user,
        productsList,
        categoriesList,
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        newProductPath: ctx.router.url('products.new'),
        editProductPath: (product) => ctx.router.url('products.edit', { id:product.id }),
        showProductPath: (product) => ctx.router.url('products.show', { id:product.id }),
        deleteProductPath: (product) => ctx.router.url('products.delete', { id:product.id }),
    });
});

router.get('users.myMessagesList', '/myMessagesList', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const messagesList = await ctx.orm.message.findAll( { where: { senderUserId:user.id } || { receiverUserId:user.id }  } );
    await ctx.render('users/MessagesList', {
        user,
        messagesList,
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        newMessagePath: ctx.router.url('messages.new'),
        editMessagePath: (message) => ctx.router.url('messages.edit', { id:message.id }),
        showMessagePath: (message) => ctx.router.url('messages.show', { id:message.id }),
        deleteMessagePath: (message) => ctx.router.url('messages.delete', { id:message.id }),
    });
});
module.exports = router;
