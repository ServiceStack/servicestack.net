using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MyApp.Pages.Shared;

public class VideoFeature : PageModel
{
    public string TitleTop { get; set; }
    public string? TitleBottom { get; set; }
    public string? Subtitle { get; set; }
    public string YoutubeId { get; set; }
}