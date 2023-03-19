using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MyApp.Pages.Shared;

public class DocsHeader : PageModel
{
    public string Heading { get; set; }
    public string SubHeading { get; set; }
}
