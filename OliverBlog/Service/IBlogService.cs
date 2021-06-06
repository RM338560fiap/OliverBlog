using OliverBlog.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OliverBlog.Service
{
    public interface IBlogService
    {
        List<BlogPost> GetLatestPosts();

        string GetPostText(string link);

        List<BlogPost> GetOlderPosts(int oldestPostId);
    }
}
