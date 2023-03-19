using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MyApp.Pages.Shared;

public class Hero : PageModel
{
    public string BackgroundUrl { get; set; } = "/img/backgrounds/bg-header.jpg";
    public string BackgroundClass { get; set; } = "bg-opacity-80";
    public string Heading { get; set; }
    public string? SubHeading { get; set; }
    public string? ActionUrl { get; set; }
    public string? ActionText { get; set; }
    public string? Content { get; set; }
    public string ContentStyle { get; set; } = "min-height:713px";
}
