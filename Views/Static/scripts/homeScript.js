{

    $(document).ready(function(){
        let postList = $("#post-list > li");

        for(let postLi of postList){
            // console.log(postLi.id.split("-")[1]);
            let postId = postLi.id.split("-")[1];
            deletePost(`post-delete-${postId}`);
            createComment(`add-comment-form-${postId}`);

            let commentList = $(`#${postId} > li`);

            for(let commentLi of commentList){
                // console.log(commentLi.id);
                let commentId = commentLi.id;

                deleteComment(`comment-delete-${commentId}`);
            }

            
        }


    });

    let createPost = function(){
        let addPostForm = $("#add-post-form");

        addPostForm.on("submit", function(event){
            event.preventDefault();
        
            $.ajax({
                type: "post",
                url: "/post/create-post",
                data: addPostForm.serialize(),
                success: function(data){
                    let newPost = postItem(data.post);
                    $("#post-list").prepend(newPost);
                    deletePost(`post-delete-${data.post._id}`);
                    createComment(`add-comment-form-${data.post._id}`);
                    // console.log(data);
                },
                error: function(err){
                    console.log(err);
                }
            });
        });
    };

    function createComment(commentFormLink){
        let addCommentForm = $(`#${commentFormLink}`);

        addCommentForm.submit(function(event){
            event.preventDefault();

            $.ajax({
                type: "post",
                url: "/post/create-comment",
                data: addCommentForm.serialize(),
                success: function(data){
                    // console.log(data);
                    let newComment = commentItem(data.comment);
                    $(`#${ data.comment.post }`).prepend(newComment);
                    deleteComment(`comment-delete-${data.comment._id}`);
                    // console.log(data);
                },
                error: function(err){
                    console.log(err);
                }
            });

        });
    }

    function deletePost(postId){
        let postDel = $(`#${postId}`);
        // console.log(postDel);

        postDel.click(function(event){
            event.preventDefault();

            $.ajax({
                method: "GET",
                url: postDel.prop("href"),
                success: function(data){
                    $(`#post-${data.post}`).remove();
                },
                error: function(err){
                    console.log(err);
                }
            });
        });
    }

    function deleteComment(commentId){
        let commentDel = $(`#${commentId}`);

        // console.log(commentDel);
        commentDel.click(function(event){
            event.preventDefault();

            $.ajax({
                method: "GET",
                url: commentDel.prop("href"),
                success: function(data){
                    // console.log(data);
                    $(`#${data.comment}`).remove();
                },
                error: function(err){
                    console.log(err);
                }
            });
        });
    }

    function commentItem(comment){
        // console.log(comment);
        return `

        <li id="${ comment._id }">
        <div class="comment">
            <h5>${ comment.user.username }</h5>
            <p>${ comment.commentContent }</p>
        </div>

        <div class="comment-delete">
            <a id="comment-delete-${ comment._id }" href="/post/delete-comment/${ comment._id }"><i class="fa-solid fa-trash-can"></i></a>
        </div>
        
    </li>

        `;
    }

    function postItem(post){
        // console.log(post);
        let comments = ``;
        for(let comment of post.comments){
            comments += `<li>
            <div class="comment">
                <h5>${ comment.user.username }</h5>
                <p>${ comment.commentContent }</p>
            </div>
    
            <div class="comment-delete">
                <a id="comment-delete-${ comment.id }" href="/post/delete-comment/${ comment.id }"><i class="fa-solid fa-trash-can"></i></a>
            </div>
            
        </li>`;
        }

        return $(`

        <li id="post-${ post._id }">
            <div class="post">
            <h5>${ post.user.username }</h5>
            <div class="post-body">
                <div class="post-content">
                    <p>${ post.postContent }</p>
                </div>
                <div class="post-comment">
                    <div class="comment-form">
                        <form action="/post/create-comment" id="add-comment-form-${ post._id }" method="post">
                            <input type="text" name="commentContent" placeholder="Add your comment here..">
                            <input type="hidden" name="post" value="${ post._id }">
                            <button type="submit">Post</button>
                        </form>
                    </div>
                    
                </div>
            
            </div>
            
            <div class="post-delete">
                <a id="post-delete-${ post._id }" href="/post/post-delete/${ post._id }"><i class="fa-regular fa-trash-can"></i></a>
            </div>
            
            </div>

            
            <div id="comment-section">
            <h3 class="head">
                Comments
            </h3>
            <ul id="${ post._id }" class="comment-list">`+comments+
            `    
            </ul>
            </div>


        </li>

        `);
    }

    createPost();

}

