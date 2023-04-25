using ServiceStack.IO;

namespace MyApp;

public class MarkdownMeta
{
    MarkdownBlog Blog { get; }
    public MarkdownMeta(MarkdownBlog blog)
    {
        Blog = blog;
    }

    public async Task RenderToAsync(string metaDir, string baseUrl)
    {
        FileSystemVirtualFiles.RecreateDirectory(metaDir);
        var allYears = Blog.VisiblePosts.Select(x => x.Date!.Value.Year).Distinct().ToList();
        var index = new Dictionary<string, object> {
            ["posts"] = allYears.Map(x => baseUrl.CombineWith($"/{x}/posts.json"))
        };
        foreach (var year in allYears)
        {
            var yearPosts = Blog.GetPosts(year: year);
            var posts = yearPosts.Map(x => new MarkdownFileBase {
                Slug = x.Slug,
                Title = x.Title,
                Summary = x.Summary,
                Date = x.Date,
                Tags = x.Tags,
                Author = x.Author,
                Image = x.Image,
                Url = x.Url ?? baseUrl.CombineWith($"/posts/{x.Slug}"),
            });
            var yearDir = metaDir.CombineWith(year).AssertDir();
            var metaPath = yearDir.CombineWith("posts.json");
            await File.WriteAllTextAsync(metaPath, posts.ToJson());
        }
        await File.WriteAllTextAsync(metaDir.CombineWith("index.json"), JSON.stringify(index));
    }
}