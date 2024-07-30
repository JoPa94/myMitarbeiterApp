using WebApplication1.Services;
using webAppServer.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace Test2
{



    [TestClass]
    public class UnitTest1
    {
        private static MitarbeiterService _mitarbeiterService;
        private static ServiceProvider? _serviceProvider;

        //private Mitarbeiter resolveService;

        [TestMethod]
        public async Task GetByID_Should_Be_OK()
        {
            //var test = new Mitarbeiter();
            Initialize(out _serviceProvider);

            try
            {
                var test = await _mitarbeiterService.GetByID(6);
                Assert.IsNotNull(test);
            }
            finally 
            {
                Console.WriteLine("Cleanup");
            }

        }

        private void Initialize(out ServiceProvider resolveService)
        {
            var service = new ServiceCollection();

            var configuration = new ConfigurationBuilder().Build();

            //builder.Services.AddScoped<MitarbeiterService>();
            service.AddScoped<MitarbeiterService>();

            service.AddDbContext<MyJuStartContext>(options => options.UseSqlServer("Data Source=tcp:releasetest.myjugendhilfe.de,8050;Initial Catalog=myJuStart;User Id=sa;Password=beef91c2-185d-4be7-a473-f85074028c15;TrustServerCertificate=True"));

            _serviceProvider = service.BuildServiceProvider();

            _mitarbeiterService = _serviceProvider.GetService<MitarbeiterService>();

            resolveService = _serviceProvider;
        }
    }
}