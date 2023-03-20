// run node postinstall.js to update with latest version
using ServiceStack.IO;

namespace Ssg;

public class MarkdownVideos : MarkdownPagesBase<MarkdownFileInfo>
{
    public MarkdownVideos(ILogger<MarkdownVideos> log) : base(log) {}
    public Dictionary<string, List<MarkdownFileInfo>> Groups { get; set; } = new();
    
    public void LoadFrom(string fromDirectory)
    {
        Groups.Clear();
        var fs = AssertVirtualFiles();
        var dirs = fs.GetDirectory(fromDirectory).GetDirectories().ToList();
        log.LogInformation("Found {0} video directories", dirs.Count);

        var pipeline = CreatePipeline();

        foreach (var dir in dirs)
        {
            var group = dir.Name;

            foreach (var file in dir.GetFiles().OrderBy(x => x.Name))
            {
                try
                {
                    var doc = Load(file.VirtualPath, pipeline);
                    if (doc == null)
                        continue;

                    var groupVideos = Groups.GetOrAdd(group, v => new List<MarkdownFileInfo>());
                    groupVideos.Add(doc);
                }
                catch (Exception e)
                {
                    log.LogError(e, "Couldn't load {0}: {1}", file.VirtualPath, e.Message);
                }
            }
        }
    }
}