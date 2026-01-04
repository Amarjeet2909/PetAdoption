using FluentValidation;
using FluentValidation.AspNetCore;
using PetAdoption.API.Middleware;
using PetAdoption.API.Validators.Pets;
using PetAdoption.Application.Interfaces.Persistence;
using PetAdoption.Application.Interfaces.Repositories;
using PetAdoption.Application.Interfaces.Services;
using PetAdoption.Application.Services;
using PetAdoption.Infrastructure;
using PetAdoption.Infrastructure.Persistence;
using PetAdoption.Infrastructure.Repositories;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog - Logging
Log.Logger = new LoggerConfiguration() // Creates the global Serilog logger
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] " + "[CorrelationId={CorrelationId}] " + "{Message:lj}{NewLine}{Exception}")
    .WriteTo.File(path: "Logs/log-.txt",rollingInterval: RollingInterval.Day, outputTemplate:
    "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] " +
    "[CorrelationId={CorrelationId}] " +
    "{Message:lj}{NewLine}{Exception}")
    .CreateLogger();

// switches ASP.NET Core to Serilog
builder.Host.UseSerilog();

// Add Controllers (Web API)
builder.Services.AddControllers();

// Infrastructure (DbContext, etc.)
builder.Services.AddInfrastructure(builder.Configuration);

// Dependency Injection
builder.Services.AddScoped<IPetRepository, PetRepository>();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreatePetRequestValidator>();

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IPetService, PetService>();

// Swagger (for development & Postman testing)
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// ===============================
// Middleware Pipeline
// ===============================


// Comment this for now to avoid warning (optional)
// app.UseHttpsRedirection();

// Correlation middleware is a request-scoped context initializer - Adds identity to the request - Enables observability
app.UseMiddleware<CorrelationIdMiddleware>();

app.UseSerilogRequestLogging(options =>
{
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        if (httpContext.Items.TryGetValue("X-Correlation-Id", out var correlationId))
        {
            diagnosticContext.Set("CorrelationId", correlationId);
        }
    };
});

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
