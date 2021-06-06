//define(['./template.js'], function (template) {
//    var blogPostUrl = '/Home/LatestBlogPosts/';
//    function loadLatestBlogPosts() {
//        fetch(blogPostUrl)
//            .then(function (response) {
//                return response.json();
//            }).then(function (data) {
//                //console.log(data);
//                template.appendBlogList(data);
//            });
//    }
//    return {
//        loadLatestBlogPosts: loadLatestBlogPosts,
//    }
//});

//define(['./template.js','../lib/showdown/showdown.js'], function (template, showdown) {
//    var _latestBlogPosts = '/Home/LatestBlogPosts/';
//    var _blogPostUrl = '/Home/Post/?link='
//    function loadLatestBlogPosts() {
//        fetch(_latestBlogPosts)
//            .then(function (response) {
//                return response.json();
//            }).then(function (data) {
//                //console.log(data);
//                template.appendBlogList(data);
//            });
//    }
//    function loadBlogPost(link) {
//        fetch(_blogPostUrl+link)
//            .then(function (response) {
//                //return response.json();
//                return response.text();
//            }).then(function (data) {
//                var converter = new showdown.Converter();
//                html = converter.makeHtml(data);
//                template.showBlogItem(html, link);
//                window.location = '#' + link
//            });
//    }
//    return {
//        loadLatestBlogPosts: loadLatestBlogPosts,
//        loadBlogPost: loadBlogPost
//    }
//});


//define(['./template.js', '../lib/showdown/showdown.js'], function (template, showdown) {
//    var blogLatestPostsUrl = '/Home/LatestBlogPosts/';
//    var blogPostUrl = '/Home/Post/?link='
//    var blogMorePostsUrl = '/Home/MoreBlogPosts/?oldestBlogPostId=';
//    var oldestBlogPostId = 0;
//    function setOldestBlogPostId(data) {
//        var ids = data.map(item => item.postId);
//        oldestBlogPostId = Math.min(...ids);
//    }
//    function loadLatestBlogPosts() {
//        fetch(blogLatestPostsUrl)
//            .then(function (response) {
//                return response.json();
//            }).then(function (data) {
//                console.log(data);
//                template.appendBlogList(data);
//                setOldestBlogPostId(data);
//            });
//    }
//    function loadBlogPost(link) {
//        fetch(blogPostUrl+link)
//        .then(function (response) {
//            //return response.json();
//            return response.text();
//        }).then(function (data) {
//            var converter = new showdown.Converter();
//            html = converter.makeHtml(data);
//            template.showBlogItem(html, link);
//            window.location = '#' + link
//        });
//    }
//    function loadMoreBlogPosts() {
//        fetch(blogMorePostsUrl + oldestBlogPostId)
//            .then(function (response) {
//                return response.json();
//            }).then(function (data) {
//                console.log(data);
//                template.appendBlogList(data);
//                setOldestBlogPostId(data);
//            });
//    }
//    function loadData(url) {
//        fetch(url)
//            .then(function (response) {
//                return response.json();
//            }).then(function (data) {
//                console.log(data);
//                template.appendBlogList(data);
//                setOldestBlogPostId(data);
//            });
//    }
//    function loadLatestBlogPosts() {
//        loadData(blogLatestPostsUrl);
//    }
//    function loadMoreBlogPosts() {
//        loadData(blogMorePostsUrl + oldestBlogPostId);
//    }
//    return {
//        loadLatestBlogPosts: loadLatestBlogPosts,
//        loadBlogPost: loadBlogPost,
//        loadMoreBlogPosts: loadMoreBlogPosts
//    }
//});


define(['./template.js', '../lib/showdown/showdown.js', './clientStorage.js'], function (template, showdown, clientStorage) {

    var blogLatestPostsUrl = '/Home/LatestBlogPosts/';
    var blogPostUrl = '/Home/Post/?link='
    var blogMorePostsUrl = '/Home/MoreBlogPosts/?oldestBlogPostId=';
    var oldestBlogPostId = 0;


    function loadMoreBlogPosts() {
        loadData(blogMorePostsUrl +
            clientStorage.getOldestBlogPostId());
    }
   
    function setOldestBlogPostId(data) {
        var ids = data.map(item => item.postId);
        oldestBlogPostId = Math.min(...ids);
    }
    function loadLatestBlogPosts() {
        fetch(blogLatestPostsUrl)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                console.log(data);
                template.appendBlogList(data);
                setOldestBlogPostId(data);
            });
    }

    function loadBlogPost(link) {
        fetch(blogPostUrl + link)
            .then(function (response) {
                //return response.json();
                return response.text();
            }).then(function (data) {
                var converter = new showdown.Converter();
                html = converter.makeHtml(data);
                template.showBlogItem(html, link);
                window.location = '#' + link
            });
    }
    function loadMoreBlogPosts() {
        fetch(blogMorePostsUrl + oldestBlogPostId)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                console.log(data);
                template.appendBlogList(data);
                setOldestBlogPostId(data);
            });
    }
    function loadData(url) {
        fetch(url)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                console.log(data);
                template.appendBlogList(data);
                setOldestBlogPostId(data);
            });
    }
    function loadLatestBlogPosts() {
        loadData(blogLatestPostsUrl);
    }
    function loadMoreBlogPosts() {
        loadData(blogMorePostsUrl + oldestBlogPostId);
    }

    function fetchPromise(url) {
        return new Promise(function (resolve, reject) {
            fetch(url)
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                    clientStorage.addPosts(data)
                        .then(function () {
                            resolve('The connection is OK, showing latest results');
                        });
                }).catch(function (e) {
                    resolve('No connection, showing offline results');
                });
            setTimeout(function () {
                resolve('The connection is hanging, showing offline results');
            }, 1000);
        });
    }

    //function loadData(url) {
    //    fetchPromise(url)
    //        .then(function (status) {
    //            $('#connection-status').html(status);
    //        });
    //}

    function loadData(url) {
        fetchPromise(url)
            .then(function (status) {
                $('#connection-status').html(status);
                clientStorage.getPosts()
                    .then(function (posts) {
                        template.appendBlogList(posts);
                    })
            });
    }

    return {
        loadLatestBlogPosts: loadLatestBlogPosts,
        loadBlogPost: loadBlogPost,
        loadMoreBlogPosts: loadMoreBlogPosts
    }
});