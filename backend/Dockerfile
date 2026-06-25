# ══════════════════════════════════════════════════════════════
# Stage 1: BUILD
# Uses full .NET SDK to restore packages and compile the app.
# This stage is heavy (~800MB) but is NEVER shipped to production.
# Only the output (published artifacts) moves to Stage 2.
# ══════════════════════════════════════════════════════════════
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# ── Copy only .csproj files first ──────────────────────────────
# Docker caches each instruction as a layer.
# If no .csproj changes → dotnet restore layer is reused → fast builds.
COPY src/PetAdoption.API/PetAdoption.API.csproj                         src/PetAdoption.API/
COPY src/PetAdoption.Application/PetAdoption.Application.csproj         src/PetAdoption.Application/
COPY src/PetAdoption.Domain/PetAdoption.Domain.csproj                   src/PetAdoption.Domain/
COPY src/PetAdoption.Infrastructure/PetAdoption.Infrastructure.csproj   src/PetAdoption.Infrastructure/

# ── Restore all NuGet packages ─────────────────────────────────
RUN dotnet restore src/PetAdoption.API/PetAdoption.API.csproj

# ── Now copy all source code ───────────────────────────────────
# Placed AFTER restore so source changes don't bust the restore cache.
COPY src/ src/

# ── Publish release build ──────────────────────────────────────
RUN dotnet publish src/PetAdoption.API/PetAdoption.API.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore

# ══════════════════════════════════════════════════════════════
# Stage 2: RUNTIME
# Uses only the ASP.NET runtime (~200MB, no SDK, no compiler).
# This is the FINAL image that gets pushed to the registry.
# ══════════════════════════════════════════════════════════════
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# ── Security: run as non-root user ────────────────────────────
RUN adduser --disabled-password --gecos "" appuser \
    && chown -R appuser /app
USER appuser

# ── Copy only the published output from Stage 1 ───────────────
COPY --from=build /app/publish .

# ── Port & entry point ────────────────────────────────────────
# Render injects PORT env var. ASPNETCORE_HTTP_PORTS picks it up.
# Locally docker-compose sets it to 8080.
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "PetAdoption.API.dll"]