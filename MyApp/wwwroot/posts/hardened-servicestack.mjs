import FeaturePillars from "./components/FeaturePillars.mjs"
import FeatureMatrix from "./components/FeatureMatrix.mjs"

/** The six areas the security audit strengthened */
const HardeningPillars = {
    components: { FeaturePillars },
    template: `<FeaturePillars eyebrow="Codebase-wide audit" title="Where the hardening landed"
        description="The most consequential fixes strengthen trust boundaries and the handling of untrusted input. Select an area to see what changed."
        :pillars="pillars" />`,
    setup() {
        const pillars = [
            { icon:'ID', name:'Authorization', tagline:'Identity & tenant isolation',
              summary:'Corrected checks that could grant access to the wrong user, tenant or connection - the failures that matter most because nothing else downstream can catch them.',
              points:['Fixed inverted Blazor role and permission checks','Prevented cross-circuit UI state leakage','Preserved tenant-specific Stripe Connect and Redis ACL identities','Fixed auth repository logic that could validate or update the wrong account'] },
            { icon:'{}', name:'Serialization', tagline:'Safe parsing of untrusted input',
              summary:'Removed the paths where hostile documents could turn into code execution, outbound requests or a crashed process.',
              points:['Removed process-wide insecure-deserialization bypasses','Restricted untrusted runtime type creation','Deprecated BinaryFormatter paths','Enforced safe XML reader settings','Bounded recursive parsing against stack exhaustion','Closed XXE and SSRF vectors'] },
            { icon:'SQL', name:'Injection & encoding', tagline:'Queries, webhooks & output',
              summary:'Closed the gaps where attacker-controlled text could change the meaning of a query, a document or a page.',
              points:['Closed SQL validation and quoted-identifier bypasses','Added Stripe webhook signature and replay-window verification','Hardened process argument handling','Protected CSV exports from formula injection','Encoded dynamic HTML, JavaScript and Swagger UI content'] },
            { icon:'URL', name:'Paths & redirects', tagline:'File and URL boundaries',
              summary:'Made virtual file access and redirect targets behave consistently across every provider, so a crafted path or return URL cannot escape its boundary.',
              points:['Canonicalized virtual-file paths across local, S3, Azure and Google Cloud','Enforced directory boundaries','Sanitized desktop file names','Rejected unsafe return URLs and URI schemes'] },
            { icon:'#', name:'Cryptography', tagline:'Comparisons, randomness & keys',
              summary:'Modernized the primitives behind authentication so verification leaks nothing through timing and malformed material is rejected rather than misinterpreted.',
              points:['Fixed-time comparisons for password, digest and anti-forgery verification','Modernized random-number generation and certificate loading','Safely rejected malformed hashes and signatures','Ensured native cryptographic resources are disposed'] },
            { icon:'DoS', name:'Availability', tagline:'DoS defenses & leaks',
              summary:'Bounded the work a single request can cause and fixed the slow leaks that degrade a long-running server.',
              points:['Added regex timeouts, upload limits and parser bounds checks','Propagated cancellation','Bounded caches and acknowledgement tracking','Fixed temporary-file, socket, stream, native-memory, OS-handle and event-subscription leaks'] },
        ]
        return { pillars }
    }
}

/** Searchable index of every published per-package audit report */
const AuditReports = {
    components: { FeatureMatrix },
    template: `<FeatureMatrix eyebrow="Published for review" title="Audit reports for every package"
        description="Every change from the audit is documented in its package's SECURITY_CHANGES.md, so your security team can review exactly what was fixed rather than take an upgrade on faith."
        placeholder="Search packages…" :features="features" />`,
    setup() {
        const gh = 'https://github.com/ServiceStack/ServiceStack/blob/main/'
        const src = name => `${gh}ServiceStack/src/${name}/SECURITY_CHANGES.md`
        const repo = name => `${gh}${name}/SECURITY_CHANGES.md`
        const features = [
            { name:'ServiceStack', category:'Core', href:src('ServiceStack'), text:'Core runtime, request pipeline, authentication, sessions and virtual file system.', keywords:'apphost pipeline auth session vfs' },
            { name:'ServiceStack.Common', category:'Core', href:src('ServiceStack.Common'), text:'Shared utilities, validation helpers and extension methods used across the stack.', keywords:'utils validation' },
            { name:'ServiceStack.Interfaces', category:'Core', href:src('ServiceStack.Interfaces'), text:'Contracts and attributes shared by every ServiceStack library.', keywords:'contracts attributes dtos' },
            { name:'ServiceStack.Text', category:'Serialization', href:repo('ServiceStack.Text'), text:'JSON, JSV and CSV serialization, type resolution and parsing bounds.', keywords:'json jsv csv serializer parsing' },
            { name:'ServiceStack.MsgPack', category:'Serialization', href:src('ServiceStack.MsgPack'), text:'MessagePack serialization format support.', keywords:'msgpack binary' },
            { name:'ServiceStack.ProtoBuf', category:'Serialization', href:src('ServiceStack.ProtoBuf'), text:'Protocol Buffers serialization format support.', keywords:'protobuf binary grpc' },
            { name:'ServiceStack.OrmLite', category:'Data', href:repo('ServiceStack.OrmLite'), text:'SQL generation, quoted identifiers, database metadata and query construction.', keywords:'sql rdbms database orm injection' },
            { name:'ServiceStack.Redis', category:'Data', href:repo('ServiceStack.Redis'), text:'Client pooling, master/replica routing, ACL identities and distributed locks.', keywords:'redis cache lock pool' },
            { name:'ServiceStack.Server', category:'Data', href:src('ServiceStack.Server'), text:'Server-side data, caching and messaging providers.', keywords:'cache mq server' },
            { name:'ServiceStack.Caching.Memcached', category:'Data', href:src('ServiceStack.Caching.Memcached'), text:'Memcached cache client integration.', keywords:'cache memcached' },
            { name:'ServiceStack.Extensions', category:'Data', href:src('ServiceStack.Extensions'), text:'gRPC, Identity and additional .NET integrations.', keywords:'grpc identity' },
            { name:'ServiceStack.Authentication.MongoDb', category:'Auth', href:src('ServiceStack.Authentication.MongoDb'), text:'MongoDB-backed authentication repository.', keywords:'mongo auth repository users' },
            { name:'ServiceStack.Authentication.RavenDb', category:'Auth', href:src('ServiceStack.Authentication.RavenDb'), text:'RavenDB-backed authentication repository.', keywords:'ravendb auth repository users' },
            { name:'ServiceStack.Stripe', category:'Auth', href:repo('ServiceStack.Stripe'), text:'Stripe gateway, Connect identities and webhook signature verification.', keywords:'stripe payments webhook connect billing' },
            { name:'ServiceStack.Jobs', category:'Messaging', href:src('ServiceStack.Jobs'), text:'Background jobs, scheduled tasks and worker lifecycle.', keywords:'jobs background worker scheduled' },
            { name:'ServiceStack.RabbitMq', category:'Messaging', href:src('ServiceStack.RabbitMq'), text:'RabbitMQ transport, acknowledgement tracking and recovery.', keywords:'rabbitmq mq queue ack' },
            { name:'ServiceStack.Aws', category:'Cloud', href:repo('ServiceStack.Aws'), text:'S3 virtual files, DynamoDB and SQS integrations.', keywords:'aws s3 dynamodb sqs' },
            { name:'ServiceStack.Azure', category:'Cloud', href:repo('ServiceStack.Azure'), text:'Azure Blob virtual files and Service Bus messaging.', keywords:'azure blob servicebus' },
            { name:'ServiceStack.GoogleCloud', category:'Cloud', href:src('ServiceStack.GoogleCloud'), text:'Google Cloud Storage virtual files and Pub/Sub messaging.', keywords:'gcp google storage pubsub' },
            { name:'ServiceStack.AI', category:'AI', href:src('ServiceStack.AI'), text:'AI Chat, providers, API Tools and MCP surface area.', keywords:'ai chat llm mcp tools' },
            { name:'ServiceStack.Blazor', category:'UI', href:repo('ServiceStack.Blazor'), text:'Blazor components, role and permission checks and circuit state isolation.', keywords:'blazor components circuit roles' },
            { name:'ServiceStack.Mvc', category:'UI', href:src('ServiceStack.Mvc'), text:'ASP.NET MVC integration and view helpers.', keywords:'mvc razor views' },
            { name:'ServiceStack.Razor', category:'UI', href:src('ServiceStack.Razor'), text:'Razor view engine hosting and rendering.', keywords:'razor views templates' },
            { name:'ServiceStack.Desktop', category:'UI', href:src('ServiceStack.Desktop'), text:'Desktop app hosting, file dialogs and name sanitization.', keywords:'desktop chromium files' },
            { name:'ServiceStack.Kestrel', category:'UI', href:src('ServiceStack.Kestrel'), text:'Kestrel self-hosting integration.', keywords:'kestrel host' },
            { name:'ServiceStack.ImageSharp', category:'Media', href:src('ServiceStack.ImageSharp'), text:'Image resizing, decoding limits and resource disposal.', keywords:'image resize imagesharp' },
            { name:'ServiceStack.Skia', category:'Media', href:src('ServiceStack.Skia'), text:'SkiaSharp image processing and native resource handling.', keywords:'skia image native' },
            { name:'ServiceStack.Client', category:'Clients', href:src('ServiceStack.Client'), text:'Typed Service Client, redirect handling and URI scheme validation.', keywords:'client jsonserviceclient redirect' },
            { name:'ServiceStack.HttpClient', category:'Clients', href:src('ServiceStack.HttpClient'), text:'HttpClient-based Service Client implementation.', keywords:'httpclient client' },
            { name:'ServiceStack.GrpcClient', category:'Clients', href:src('ServiceStack.GrpcClient'), text:'gRPC Service Client and channel lifecycle.', keywords:'grpc client channel' },
            { name:'ServiceStack.NetFramework', category:'Clients', href:src('ServiceStack.NetFramework'), text:'.NET Framework compatibility support.', keywords:'netfx net472 framework' },
            { name:'ServiceStack.Logging', category:'Diagnostics', href:repo('ServiceStack.Logging'), text:'Logging providers and diagnostic output handling.', keywords:'logging serilog nlog' },
            { name:'ServiceStack.Api.OpenApi', category:'OpenAPI', href:src('ServiceStack.Api.OpenApi'), text:'Swagger UI content encoding and OpenAPI schema generation.', keywords:'openapi swagger xss' },
            { name:'ServiceStack.AspNetCore.OpenApi', category:'OpenAPI', href:src('ServiceStack.AspNetCore.OpenApi'), text:'ASP.NET Core OpenAPI document generation.', keywords:'openapi aspnetcore' },
            { name:'ServiceStack.OpenApi.Microsoft', category:'OpenAPI', href:src('ServiceStack.OpenApi.Microsoft'), text:'Microsoft OpenAPI library integration.', keywords:'openapi microsoft' },
            { name:'ServiceStack.OpenApi.Swashbuckle', category:'OpenAPI', href:src('ServiceStack.OpenApi.Swashbuckle'), text:'Swashbuckle integration for OpenAPI documents.', keywords:'openapi swashbuckle swagger' },
        ]
        return { features }
    }
}

export default {
    components: {
        HardeningPillars,
        AuditReports,
    }
}
