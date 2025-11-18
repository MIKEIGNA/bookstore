# FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# WORKDIR /app
# EXPOSE 80

# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# WORKDIR /src
# COPY ["BookStoreApi.csproj", "./"]
# RUN dotnet restore "BookStoreApi.csproj"
# COPY . .
# RUN dotnet publish "BookStoreApi.csproj" -c Release -o /app/publish

# FROM base AS final
# WORKDIR /app
# COPY --from=build /app/publish .
# ENTRYPOINT ["dotnet", "BookStoreApi.dll"]


# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore
COPY ./BookStoreApi.csproj ./
RUN dotnet restore "BookStoreApi.csproj"

# copy everything and publish
COPY . .
RUN dotnet publish "BookStoreApi.csproj" -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "BookStoreApi.dll"]
