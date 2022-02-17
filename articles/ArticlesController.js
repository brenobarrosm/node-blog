const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("../articles/Article");
const slugify = require("slugify");

// ========== GET ROUTES ==========

//List articles
router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles});
    });
});

//Form new article
router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
    });
    
});

//Form edit article
router.get('/admin/articles/edit/:id', (req, res) => {
    var id = req.params.id;
    Article.findByPk(id).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {article: article, categories: categories});
            });
            
        } else {
            res.redirect('/admin/articles');
        }
    }).catch(err => {
        res.redirect('/admin/articles');
    });
});

//Pagination
router.get('/articles/page/:page', (req, res) => {
    var page = req.params.page;
    var offset = 0;
    const limit = 4;

    if(isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * limit;
    }

    Article.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {

        var next;
        if(offset + limit >= articles.count) {
            next = false;
        } else {
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page', {result: result, categories: categories})
        }).catch(err => {
            res.redirect('/admin/articles');
        });

    });
});

// ========== POST ROUTES ==========

//Save article
router.post('/articles/save', (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles');
    });;

});

//Delete article
router.post('/articles/delete', (req, res) =>  {
    var id = req.body.id;
    if(id != undefined) {
        if(!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles');
            });
        } else {
            res.redirect('/admin/articles');
        }
    } else {
        res.redirect('/admin/articles');
    }
});

//Update article
router.post('/articles/update', (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({
        title: title,
        body: body,
        categoryId: category,
        slug: slugify(title)
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles');
    }).catch(err => {
        res.redirect('/admin/articles');
    });
});

module.exports = router;