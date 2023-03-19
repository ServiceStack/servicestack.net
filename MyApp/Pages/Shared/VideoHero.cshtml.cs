using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MyApp.Pages.Shared;

public class VideoHero : PageModel
{
    public string BackgroundUrl { get; set; }
    public string Heading { get; set; }
    public string SubHeading { get; set; }
    public string? ActionUrl { get; set; }
    public string? ActionText { get; set; }
    public string? YoutubeId { get; set; }
}
