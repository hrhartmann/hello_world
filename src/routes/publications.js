const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadPublication(ctx, next){
    ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.id);
    return next();
}

router.get('publications.list', '/', async (ctx) => {
    const publicationsList = await ctx.orm.publication.findAll();
    await ctx.render('publications/index', {
        publicationsList,
        newPublicationPath: ctx.router.url('publications.new'),
        usersListPath: ctx.router.url('users.list'),
        editPublicationPath: (publication) => ctx.router.url('publications.edit', { id:publication.id }),
        deletePublicationPath: (publication) => ctx.router.url('publications.delete', { id:publication.id }),
        showPublicationPath: (publication) => ctx.router.url('publications.show', { id:publication.id }),
    });
});

router.get('publications.newPublication', '/newPublication', async (ctx) => {
    const publication = ctx.orm.publication.build();
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const productsList = await ctx.orm.product.findAll( { where: { userId:user.id } } );
    await ctx.render('publications/new', {
        user,
        productsList,
        newProductPath: ctx.router.url('products.new'),
        publication,
        submitPublicationPath: ctx.router.url('publications.create'),
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
    });
});

router.get('publications.edit', '/:id/edit', loadPublication, async (ctx) => {
    const { publication } = ctx.state;
    const product = await ctx.orm.product.findAll( { where: { id: publication.productId } } );
    await ctx.render('publications/edit', {
      publication,
      product,
      submitPublicationPath: ctx.router.url('publications.update', { id: publication.id }),
    });
  });

router.post('publications.create', '/', async (ctx) => {
    const { title } = ctx.request.body;
    const { image } = ctx.request.body;
    const { description } = ctx.request.body;
    const { product } = ctx.request.body;
    const id = ctx.session.userId;
    const publication = ctx.orm.publication.build({
                                                    title: title,
                                                    image: image,
                                                    description: description,
                                                    userId: id,
                                                    productId: product,
                                                });
    try {
        await publication.save(
            {
                fields: [
                    'title',
                    'image',
                    'description',
                    'productId',
                    'userId',
                ],
            },
        );
        ctx.redirect(ctx.router.url('users.publicationsList', { id:id } ));
    } catch (validationError) {
        await ctx.render('publications/new', {
            publication,
            errors: validationError.errors,
            submitPublicationPath: ctx.router.url('publications.create'),
        });
    }
});

router.patch('publications.update', '/:id', loadPublication, async (ctx) => {
    const { publication } = ctx.state;
    try {
        const {
            title,
            image,
            description,
        } = ctx.request.body;
        await publication.update({
            title,
            image,
            description,
        });
        ctx.redirect(ctx.router.url('publications.list'));
    } catch (validationError) {
        await ctx.render('publications/edit', {
            publication,
            errors: validationError.errors,
            submitPublicationPath: ctx.router.url('publications.update'),
            
        });
    }
});

router.del('publications.delete', '/:id', loadPublication, async (ctx) => {
    const { publication } = ctx.state
    await publication.destroy();
    ctx.redirect(ctx.router.url('publications.list'))
});

router.get('publications.show', '/:id/show', async (ctx) => {
    const publication = await ctx.orm.publication.findByPk(ctx.params.id);
    const commentsList = await ctx.orm.comment.findAll({ where: { publicationId: publication.id } });
    await ctx.render('publications/show', {
        publication,
        commentsList,
        newCommentPath: ctx.router.url('comments.new', { publicationId: publication.id }),
        newTradePath: ctx.router.url('trades.new', {
            publicationId: publication.id,
            userId: publication.userId,
            firstObjectId: publication.productId
        }),
        editCommentPath: (comment) => ctx.router.url('comments.edit', { id:comment.id }),
        deleteCommentPath: (comment) => ctx.router.url('comments.delete', { id:comment.id }),
        
    });
});

module.exports = router;
