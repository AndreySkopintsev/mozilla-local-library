const BookInstance = require('../models/bookinstance');
const {body,validationResult} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')
const Book = require('../models/book')

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res) {
    BookInstance.find()
        .populate('book')
        .exec(function(err,list_bookinstances){
            if(err){return next(err)}

            res.render('bookinstance_list',{title:'Book Instance List',bookinstance_list:list_bookinstances})
        })
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res) {
    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function(err,bookinstance){
        if(err) {return next(err)}
        if(bookinstance == null){
            let err = new Error('Book copy not found')
            err.status = 404
            return next(err) 
        }

        res.render('bookinstance_detail',{title:`Copy: ${bookinstance.book.title}`,bookinstance:bookinstance})
    })
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res) {
    Book.find({},'title')
        .exec(function(err,books){
            if(err){return next(err)}

            res.render('bookinstance_form',{title:'Create BookInstance',book_list:books})
        })
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    body('book', 'Book must be specified').trim().isLength({ min: 1 }),
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    (req,res,next)=>{
        const errors = validationResult(req)

        let bookInstance = new BookInstance({
            book:req.body.book,
            imprint:req.body.imprint,
            status:req.body.status,
            due_back:req.body.due_back
        })

        if(!errors.isEmpty()){
            Book.find({},'title')
                .exec(function(err,books){
                    if(err){return next(err)}

                    req.render('bookinstance_form',{ title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id , errors: errors.array(), bookinstance: bookinstance })
                })
                return
        }
        else{
            bookInstance.save(function(err){
                if(err){return next(err)}

                res.redirect(bookInstance.url)
            })
        }
    }

]

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next) {
    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function(err,book_instance){
        if(err){return next(err)}
        res.render('bookinstance_delete',{title:'Delete bookinstance',book_instance:book_instance})
    })
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res, next) {
    
    BookInstance.findByIdAndRemove(req.body.bookinstanceid,function deleteInstance(err){
        if(err){return next(err)}
        res.redirect(`/catalog/book/${req.body.bookid}`)
    })
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};