using Microsoft.AspNetCore.Mvc.Rendering;
using ServiceStack.IO;

[assembly: HostingStartup(typeof(MyApp.ConfigureSsg))]

namespace MyApp;

public class ConfigureSsg : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services =>
        {
            services.AddSingleton<RazorPagesEngine>();
            services.AddSingleton<MarkdownPages>();
            services.AddSingleton<MarkdownWhatsNew>();
            services.AddSingleton<MarkdownVideos>();
            services.AddSingleton<MarkdownBlog>();
        })
        .ConfigureAppHost(
            appHost => appHost.Plugins.Add(new CleanUrlsFeature()),
            afterPluginsLoaded: appHost =>
            {
                var pages = appHost.Resolve<MarkdownPages>();
                var whatsNew = appHost.Resolve<MarkdownWhatsNew>();
                var videos = appHost.Resolve<MarkdownVideos>();
                var blogPosts = appHost.Resolve<MarkdownBlog>();

                var markdownFeatures = new IMarkdownPages[] { pages, whatsNew, videos, blogPosts }; 
                markdownFeatures.Each(x => x.VirtualFiles = appHost.VirtualFiles);

                blogPosts.Authors = Authors;
                
                pages.LoadFrom("_pages");
                whatsNew.LoadFrom("_whatsnew");
                videos.LoadFrom("_videos");
                blogPosts.LoadFrom("_posts");
            },
            afterAppHostInit: appHost =>
            {
                // prerender with: `$ npm run prerender` 
                AppTasks.Register("prerender", args =>
                {
                    var distDir = appHost.ContentRootDirectory.RealPath.CombineWith("dist");
                    if (Directory.Exists(distDir))
                        FileSystemVirtualFiles.DeleteDirectory(distDir);
                    FileSystemVirtualFiles.CopyAll(
                        new DirectoryInfo(appHost.ContentRootDirectory.RealPath.CombineWith("wwwroot")),
                        new DirectoryInfo(distDir));
                    var razorFiles = appHost.VirtualFiles.GetAllMatchingFiles("*.cshtml");
                    RazorSsg.PrerenderAsync(appHost, razorFiles, distDir).GetAwaiter().GetResult();
                });
            });

    public List<AuthorInfo> Authors { get; } = new() {
        new("Demis Bellot", "/img/authors/demis.jpg")
        {
            GitHubUrl = "https://github.com/mythz",
            TwitterUrl = "https://twitter.com/demisbellot",
        },
        new("Darren Reid", "/img/authors/darren.jpg")
        {
            GitHubUrl = "https://github.com/layoric",
            TwitterUrl = "https://twitter.com/layoric",
        },
        new AuthorInfo("Lucy Bates", "/img/authors/author1.svg"),
    };
}

// Add additional frontmatter info to include
public class MarkdownFileInfo : MarkdownFileBase
{
}

public static class HtmlHelpers
{
    public static string ContentUrl(this IHtmlHelper html, string? relativePath) => 
        html.IsDebug()
            ? "http://localhost:5000".CombineWith(relativePath)
            : "https://servicestack.net".CombineWith(relativePath);
    public static string ApiUrl(this IHtmlHelper html, string? relativePath) => 
        html.IsDebug()
            ? "https://localhost:5001".CombineWith(relativePath)
            : "https://account.servicestack.net".CombineWith(relativePath);
}