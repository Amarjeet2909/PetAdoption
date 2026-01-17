using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.IdentityModel.Tokens;
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
using System.Text;
using PetAdoption.Application.Interfaces.Security;
using PetAdoption.Infrastructure.Security;


var builder = WebApplication.CreateBuilder(args);

// ===============================
// Serilog Configuration
// ===============================
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

// ===============================
// Services
// ===============================

// Add Controllers (Web API)
builder.Services.AddControllers();

// Infrastructure (DbContext, etc.)
builder.Services.AddInfrastructure(builder.Configuration);

// Dependency Injection
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IPetRepository, PetRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IPetService, PetService>();

// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreatePetRequestValidator>();

// Swagger (for development & Postman testing)
builder.Services.AddEndpointsApiExplorer();

// ===============================
// JWT Authentication
// ===============================
builder.Services
    .AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
