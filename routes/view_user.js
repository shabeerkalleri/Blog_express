const express = require("express")
const router = express.Router()
const UserSchema = require("../models/user_model")

router.get("/", function (req, res, next) {
// pagination of user
    const pageOptions = {
        offset: parseInt(req.query.offset, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 20,
    };


    UserSchema.aggregate([
        {
            $lookup: {
                from: "blogs",
                localField: "_id",
                foreignField: "author",
                as: "blog",
            },
        },
        { $unwind: { path: "$blog", preserveNullAndEmptyArrays: true } },

        {
            $sort: { email: 1 },
        },
        {
            $project: {
                _id: 1,
                user_name: 1,
                password: 1,
                email: 1,
                author: {
                    author_id: "$blog._id",
                   author_title : "$blog.title",
                    author_content: "$blog.content"
                }
            },
        },
    ]).skip(pageOptions.offset * pageOptions.limit)
        .limit(pageOptions.limit)
        .then((result) => {
            res.json({
                success: true,
                message: "Users list",
                data:result,
            });
        })
        .catch((err) => {
            res.json({ success: false, message: err });
        });
});
module.exports=router