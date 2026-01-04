using Serilog.Context;

namespace PetAdoption.API.Middleware
{
    public class CorrelationIdMiddleware
    {
        private const string CorrelationIdHeader = "X-Correlation-Id";
        private readonly RequestDelegate _next;

        public CorrelationIdMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var correlationId = context.Request.Headers.ContainsKey("X-Correlation-Id")
                ? context.Request.Headers["X-Correlation-Id"].ToString()
                : Guid.NewGuid().ToString();

            context.Items["X-Correlation-Id"] = correlationId;
            context.Response.Headers["X-Correlation-Id"] = correlationId;

            using (LogContext.PushProperty("CorrelationId", correlationId))
            {
                await _next(context);
            }
        }
    }
}
