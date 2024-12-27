const express = require("express")
const router = express.Router()
const { Types } = require("mongoose");

const verifyToken=require("../middleware/auth_middleware")
const UserSchema = require("../models/user_model")
const blogSchema = require("../models/blog_model")

// create blog
router.post("/createBlog", verifyToken,(req, res) => {
    console.log("file", req.file)
    let { title, content,author } = req.body
 
    let Blog = new blogSchema({
        title: title,
        content: content,
        author: author
    })
    Blog.save().then(data => {
        res.json({ sucess: true, message: "blog data is", data: data })

    })
        .catch(err => {
            res.json({ sucess: false, err })
            console.log("err", err)
        })
})

// view all blog
router.get("/viewBlog", (req, res) => {

    //  filter data of title
    var title = req.query.title;
    if (title === undefined) {
        title = {}
    } else {
        title = {
            $or: [
                { "name": { $regex: title + ".*", $options: 'i' } }
            ]
        }
    }
    blogSchema.aggregate([
        {
            $match: {
                $and: [title],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

        {
            $sort: { title: 1 },
        },
        {
            $project: {
                _id: 1,
                title: 1,
                content: 1,
                author: 1,
                user: {
                    user_id: "$user._id",
                    user_name: "$user.user_name",
                    user_email: "$user.email"
                }
            },
        },
    ])
        .then((result) => {
            res.json({
                success: true,
                message: "blog list",
                data: result,
            });
        })
        .catch((err) => {
            res.json({ success: false, message: err });
        });
});

// blog detail
router.get("/:blog_id", (req, res) => {
    var blog_id = req.params.blog_id

    if (!Types.ObjectId.isValid(blog_id)) {
        return res.status(400).json({ success: false, message: "Invalid Blog ID" });
    }

    blogSchema.aggregate([
        {
            $match: { "_id": new Types.ObjectId(blog_id) }
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      
        {
            $project: {
                _id: 1,
                title: 1,
                content: 1,
                author: 1,
                user: {
                    user_id: "$user._id",
                    user_name: "$user.user_name",
                    user_email: "$user.email"
                }
            },
        },
    ]).then(data2 => {
        res.status(200).json({ sucess: true, message: "view blog  detail is ", data: data2 })
    }).catch(err => {
        res.status(404).json({ sucess: false, message: "error", err })
    })
})
 
// blog delete single
router.delete("/:blog_id", (req, res) => {
    var blog_id = req.params.blog_id

    blogSchema
        .findOneAndDelete({ _id: blog_id })
        .then((data) => {
            if (data === null) {
                res.json({
                    status: "false",
                    message: "No blog  found",
                });
            } else {
                res.json({
                    status: "Sucess",
                    message: "Blog  list deleted :" + blog_id,
                    data: data,
                });
            }
        })
        .catch((err) => {
            res.json({ satus: "ERROR", err });
            console.log(err);
        });
})

//blog update
router.put("/updateBlog", function (req, res, next) {
    var blog_id=req.body.blog_id
    var title = req.body.title;
    var content = req.body.content;
    var author = req.body.author;
    blogSchema
        .find({ _id: blog_id })
        .then((data) => {
            console.log(":dara",data)
            if (data.length > 0) {
                if (title) {
                    blogSchema
                        .updateOne({ _id: blog_id }, { $set: { title: title } })
                        .then((data1) => {
                        
                        })
                        .catch((err) => {
                            res.json({ satus: "ERROR", err });
                        });
                }
                if (content) {
                    blogSchema
                        .updateOne({ _id: blog_id }, { $set: { content: content } })
                        .then((data1) => { })
                        .catch((err) => {
                            res.json({ satus: "ERROR", err });
                        });
                }
                if (author) {
                    if (author !== null) {
                        author = Types.ObjectId(author);
                    }
                    blogSchema
                        .updateOne({ _id: blog_id }, { $set: { author: author } })
                        .then((data1) => { })
                        .catch((err) => {
                            res.json({ satus: "ERROR", err });
                        });
                }
             
              
              
                res.json({
                    status: "Sucess",
                    message: "blog updated sucessfully  "

                });
            }
            else {
                res.json({ status: false, message: "invalid blog id" });
            }
        })
        .catch((err) => {
            res.json({ satus: "ERROR", err });
            console.log(err);
        });
});


module.exports=router