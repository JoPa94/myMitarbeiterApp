using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://127.0.0.1:5500")
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});
// Add services to the container.
builder.Services.AddSingleton<MitarbeiterService>();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigin");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

// TODO: Fragen wegen Studeneintragen

/*  Make sure endpoints use DB not locale file
    TODO: GET all mitarbeiter endpoint
    TODO: GET mitarbeiter by ID endpoint
    TODO: PUT mitarbeiter endpoint to update data
    TODO: POST mitarbeiter endpoint add data
    TODO: DELETE mitarbeiter endpoint to delete data*/

// JS fetch API to test