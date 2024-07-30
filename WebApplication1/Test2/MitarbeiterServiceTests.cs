using WebApplication1.Services;
using webAppServer.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using Microsoft.Identity.Client;

namespace Test2
{
    [TestClass]
    public class MitarbeiterServiceTests
    {
        private static MitarbeiterService? _mitarbeiterService;
        private static ServiceProvider? _serviceProvider;

        //private Mitarbeiter resolveService;
        [TestInitialize]
        public void TestInit2()
        {
            Initialize(out _serviceProvider);
        }

        [TestMethod]
        [DataRow("NeuerVorname", "AlterVorname")]
        [DataRow("Nachname", "AlterNachname")]
        public async Task GetByID_Should_Be_OK(string neuerVorname, string alterVorname)
        {
            var neuerMitarbeiter = new Mitarbeiter()
            {

            //Id = 0,
            Vorname = alterVorname,
            Nachname = "Nachname1",
            Geburtsdatum = DateTime.Now,
            Geschlecht = 1,
            Qualifiziert = true,
            Notiz = "xxxcxxcx",
            };

            //var test = new Mitarbeiter();
            //Initialize(out _serviceProvider);

            try
            {
                var mitarbeiterInDatabase = await _mitarbeiterService.Create(neuerMitarbeiter);
                Assert.IsNotNull(mitarbeiterInDatabase.Id);

                var mitarbeiterExists = await _mitarbeiterService.GetByID(mitarbeiterInDatabase.Id);
                Assert.AreEqual(mitarbeiterExists, mitarbeiterInDatabase);
                mitarbeiterInDatabase.Vorname = neuerVorname;


                var mitarbeiterUpdated = await _mitarbeiterService.Update(mitarbeiterInDatabase);
                Assert.AreNotEqual(alterVorname, mitarbeiterUpdated.Vorname);
                Assert.IsTrue(mitarbeiterInDatabase.Vorname.ToLower().Equals(mitarbeiterUpdated.Vorname.ToLower()));


                var isDeleted = await _mitarbeiterService.Delete(mitarbeiterUpdated.Id);
                Assert.IsTrue(isDeleted);
            }

            finally 
            {
                if(await _mitarbeiterService.GetByID(neuerMitarbeiter.Id) != null)
                {
                    await _mitarbeiterService.Delete(neuerMitarbeiter.Id);
                }
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

// TODO: Object(Mitarbeiter) in der Methode saven
// TODO:
// TODO:
// TODO:
// TODO: