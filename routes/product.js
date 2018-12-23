const router = require('express').Router();
const Product = require('../models/product');
const Comment = require('../models/comment');
const fs = require('fs');
const path = require('path');


router.get('/add-products', (req, res) => {
    const url = req.protocol + '://' + req.get('host');
   const images = fs.readdirSync(path.join(__dirname,'..', 'images'))
   console.log(images);
   
   let product = images.map((el, i) => {
    return {
        name: `some food ${i+1}` ,
        image: `${url}/images/${el}`
    }
   })

   res.json({product})
    

})

router.get('/', (req, res) => {
    const items = +req.query.items;
    const index = +req.query.index;
    console.log(index, items);
    let totalProduct;
    Product.find()
        .skip(items * (index - 1))
        .limit(items)
        .then(product => {
            totalProduct = product;
            return Product.find().countDocuments()
        })
        .then(count => {
            res.json({
                product: totalProduct.map(el => {
                    return {
                        _id: el._id,
                        name: el.name,
                        image: el.image,
                        comments: el.comments,
                        review: el.review
                    }
                }),
                count
            })
        })
        .catch(err => {
            console.log(err);
            res.status(401).send(err)
        })
})

router.get('/:id', (req, res) => {
    Product.findById({ _id: req.params.id })
        .populate('comments')
        .then(product => {
            res.json({
                product: {
                    _id: product._id,
                    name: product.name,
                    image: product.image,
                    review: product.review,
                    comments: product.comments.map(el => {
                        return {
                            _id: el._id,
                            productId: el.productId,
                            author: el.author,
                            comment: el.comment,
                            review: el.review
                        }
                    })
                }
            })
        })
        .catch(err => {
            res.send(err);
        })
})

router.post('/comment/:id', async (req, res) => {
    try {
        let product = await Product.findOne({ _id: req.params.id })
        let comment = new Comment({
            productId: req.body.productId,
            author: req.body.name,
            comment: req.body.comment,
            review: req.body.review
        })
        let savedComment = await comment.save();

        product.comments.push(savedComment._id);

        const saveProduct = await product.save();

        const UpdatedProduct = await Product.findOne({ _id: req.params.id })
            .populate('comments')

        let overallReview = UpdatedProduct.comments
            .map(el => el.review)
            .reduce((prv, curr) => prv + curr) / UpdatedProduct.comments.length;

        UpdatedProduct.review = overallReview;

        const savedProduct = await UpdatedProduct.save()

        res.status(201).json({
            _id: savedProduct._id,
            name: savedProduct.name,
            image: savedProduct.image,
            review: savedProduct.review,
            comments: savedProduct.comments.map(el => {
                return {
                    _id: el._id,
                    productId: el.productId,
                    author: el.author,
                    review: el.review,
                    comment: el.comment
                }
            })
        })

    } catch (err) {

        res.status(401).send(err);
    }
})

module.exports = router;