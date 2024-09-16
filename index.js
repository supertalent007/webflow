const express = require('express');
const Airtable = require('airtable');
const bodyParser = require('body-parser');

// Configure Airtable with your Personal Access Token and base
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'patYO3oCVeQVe6VN8.2933dc8ac03f002385330a6ec8ae920d05bfa8140914f760299fdb6af05d350c'
});
var base = Airtable.base('appux3CY1AN115igQ');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const transmissieMapping = {
    'A': 'Automaat',
    'H': 'Handgeschakeld'
};

const brandstofMapping = {
    'B': 'Benzine',
    'D': 'Diesel',
    'E': 'Elektrisch',
    'H': 'Hybride Benzine',
};

const BTW_Marge = {
    'B': 'BTW',
    'M': 'Marge'
}

const accessoryCategories = {
    'Interieur': ['115V socket', '2 zitplaatsen rechtsvoor', '4 persoons', '5 personen', '5 persoons', '6 persoons', '7 persoons', '8 persoons', '9 persoons', 'Aanraakscherm', 'Aangepast voor mindervaliden', 'Achterbank 1/3 - 2/3', 'Achterbank met massagefunctie', 'Achterstoelen verwarmd', 'Achterstoelen verwarmd en geventileerd', 'Airconditioning', 'Airco', 'Airco (automatisch)', 'Airco separaat achter', 'Alarm', 'Android Auto', 'Apple CarPlay', 'Armsteun', 'Armsteun achter', 'Armsteun voor', 'Automatische klimaatregeling', 'Automatische klimaatregeling, 2 zones', 'Automatische klimaatregeling, 3 zones', 'Automatische klimaatregeling, 4 zones', 'Bagageruimte-afscheiding', 'Bandenspanningscontrole', 'Bi-Xenon koplampen', 'Biodiesel conversie', 'Bluetooth', 'Bochtverlichting', 'Boordcomputer', 'Botswaarschuwing', 'CD', 'Centrale deurvergrendeling met afstandsbediening', 'Centrale vergrendeling', 'Cruise Control', 'Dagrijverlichting', 'Dakrails', 'Digitale radio-ontvangst', 'Dodehoekdetectie', 'E10-geactiveerd', 'Electronic Stability Program', 'Elektrisch verstelbare buitenspiegels', 'Elektrische achterbankverstelling', 'Elektrische achterklep', 'Elektrische ramen', 'Elektrische stoelverstelling', 'Elektronische parkeerrem', 'Emergency Brake Assist', 'Geheel digitaal combi-instrument', 'Getinte ramen', 'Grootlichtassistent', 'Handsfree', 'Head-up display', 'Hill-Hold Control', 'Hoofd airbag', 'Inductieladen voor smartphones', 'Isofix', 'Katalysator', 'Keyless Entry', 'Koplamp volledig LED', 'Lane Departure Warning Systeem', 'Laserlicht', 'LED dagrijverlichting', 'LED verlichting', 'Lederen bekleding', 'Lederen stuurwiel', 'Lendensteun', 'Lichtmetalen velgen', 'Lichtsensor', 'Luchtvering', 'Luifel', 'Massagestoelen', 'Mistlampen', 'MP3', 'Multifunctioneel stuurwiel', 'Muziekstreaming geïntegreerd', 'Navigatiesysteem', 'Neerklapbare passagiersstoel', 'Night view assist', 'Noodoproepsysteem', 'Noodwiel', 'Open dak', 'Panorama dak', 'Parkeerhulp', 'Parkeerhulp achter', 'Parkeerhulp automatisch', 'Parkeerhulp met camera', 'Parkeerhulp voor', 'Pechset', 'Radio', 'Range extender', 'Rechtsgestuurd', 'Regensensor', 'Reservewiel', 'Rokerspakket', 'Schakelflippers', 'Schuifdeur', 'Schuifdeur links', 'Schuifdeur rechts', 'Sfeerverlichting', 'Skiluik', 'Sneeuwbanden', 'Snelheidsbeperkingsinstallatie', 'Sound system', 'Spoiler', 'Sportonderstel', 'Sportpakket', 'Sportstoelen', 'Spraakbediening', 'Stalen velgen', 'Standkachel', 'Start/Stop-systeem', 'Startonderbreker', 'Stoelventilatie', 'Stoelverwarming', 'Stuurbekrachtiging', 'Stuurwielverwarming', 'Taxi of huurauto', 'Televisie', 'Traction Control'],
    'Exterieur': ['360° camera', '4x4', 'Achterdeuren', 'Achterdeuren met ruiten', 'Achterklep', 'Achterruiten', 'Achterruit wisser', 'Achterruitverwarming', 'Adaptieve lichten', 'Adaptief demping systeem', 'Adaptief onderstel', 'AMG-styling', 'Binnenspiegel automatisch dimmend', 'Buitenspiegel(s) automatisch dimmend', 'Buitenspiegels elektrisch verstelbaar', 'Buitenspiegels elektr. met geheugen', 'Buitenspiegels elektrisch inklapbaar', 'Buitenspiegels in carrosseriekleur', 'Buitenspiegels met verlichting', 'Buitenspiegels verwarmbaar', 'Bumpers in carrosseriekleur', 'Centrale deurvergrendeling met afstandsbediening', 'Dakrails', 'Deur ladder', 'Dimlichten automatisch', 'Diverse chrome covers', 'Elektrisch bedienbare kap', 'Elektrisch bedienbare laadklep', 'Elektrisch glazen panorama-dak', 'Elektrische achterklep', 'Elektrische buitenspiegels', 'Elektrische spiegels', 'Extra getint glas', 'Extra verlichting in bumpers', 'File assistent', 'Geïntrigeerd LPG systeem', 'Glasresteel', 'Grootlichtassistent', 'Hill-Hold Control', 'Hooker uitlaat', 'Imperiaal', 'Imperiaal aluminium', 'Keyless entry', 'Koplamp volledig LED', 'Koplampen adaptief', 'Laadklep', 'Laserlicht', 'Laser LED koplampen', 'LED achterlichten', 'LED dagrijverlichting', 'LED verlichting', 'Lichtmetalen velgen', 'Lichtmetalen velgen 16’’', 'Lichtmetalen velgen 17’’', 'Lichtmetalen velgen 18’’', 'Lichtmetalen velgen 20"', 'Lictmetalen AMG velgen 19’’', 'Luifel', 'Metaalkleur', 'Panoramadak', 'Parkeercamera', 'Parkeersensor voor en achter', 'Parkeersensor achter', 'Reservewiel', 'Sidebars', 'Skiluik', 'Smoke achterlicht', 'Smoke knipperlicht', 'Sperdifferentieel', 'Sport velgen', 'Sportonderstel', 'Treeplanken achter', 'Treeplanken verlicht', 'Trekhaak', 'Uitlaat kleppensysteem', 'Verblindingsvrij grootlicht', 'Warmtewerend glas', 'Wassysteem voor koplampen', 'Wind deflector', 'Windscherm', 'Xenon verlichting', 'Zij deur soft close', 'Zijdeur rechts', 'Zijschuifdeur links', 'Zijschuifdeur met ruit', 'Zijschuifdeur rechts', 'Zijschuifdeur rechts met ruit', 'Zonnescherm zijruiten'],
    'Infotainment': ['Alpine audiosysteem', 'Android Auto', 'Apple CarPlay', 'Audio installatie', 'Audio installatie high end', 'Audio installatie premium', 'Audio-navigatie full map', 'Autotelefoonvoorbereiding met bluetooth', 'AUX ingang', 'Bluetooth', 'CD', 'DAB', 'DAB ontvanger', 'DAB+', 'Digitale radio-ontvangst', 'Entertainment system', 'Harde schijf voor muziek', 'Head-up display', 'Inductieladen voor smartphones', 'Multifunctioneel stuurwiel', 'Muziekstreaming geïntegreerd', 'Navigatiesysteem', 'Navigatiesysteem full map + hard disk', 'Night view assist', 'Parrot', 'Radio', 'Radio cd speler', 'Radiovoorbereiding', 'Rondomzicht camera', 'Spraakbediening', 'Stuurwiel multifunctioneel', 'Televisie', 'USB', 'USB ingang', 'WiFi-hotspot', 'WiFi voorbereiding'],
    'Milieu': ['Biodiesel conversie', 'Dubbel lucht', 'E10-geactiveerd', 'Eco mode', 'Range extender', 'Sport / Eco modus', 'Start/stop systeem'],
    'Veiligheid': ['ABS', 'Achter airbag', 'Achteropkomend verkeer waarschuwing', 'Achteruitrijcamera', 'Adaptieve Cruise Control', 'Adaptive Cruise Control', 'Airbag bestuurder', 'Airbag passagier', 'Airbag(s) hoofd achter', 'Airbag(s) hoofd voor', 'Airbag(s) knie', 'Airbag(s) side achter', 'Airbag(s) side voor', 'Airbags', 'Airconditioning', 'Alarm', 'Alarm klasse 1 (startblokkering)', 'Alarm klasse 3', 'Alarmsysteem', 'Anti Blokkeer Systeem', 'Anti doorSlip Regeling', 'Anti diefstal sloten', 'Autonomous Driving', 'Autonomous Emergency Braking', 'Bandenspanningscontrole', 'Bandenspanningscontrolesysteem', 'Bearlock', 'Bi-Xenon koplampen', 'Bochtverlichting', 'Botswaarschuwing', 'Brake Assist System', 'Centrale deurvergrendeling met afstandsbediening', 'Centrale vergrendeling', 'Dodehoekdetectie', 'Dodehoekdetector', 'Dodehoekdetectie met correctie', 'Elektronische parkeerrem', 'Elektronisch Stabiliteits Programma (ESP)', 'Elektronisch Stabiliteits Programma', 'Emergency Brake Assist', 'Geheel digitaal combi-instrument', 'glaslook', 'Gordel airbag', 'Handsfree', 'Hill hold functie', 'Isofix', 'Katalysator', 'Lane Departure Warning', 'Lane Departure Warning Systeem', 'Lane Keeping Assist', 'Laserlicht', 'LED dagrijverlichting', 'Lichtmetalen velgen', 'Lichtsensor', 'Nachtzicht-assistent', 'Noodoproepsysteem', 'Panorama dak', 'Parkeerassistent', 'Parkeercamera', 'Parkeersensoren', 'Sperdifferentieel', 'Spoiler', 'Standkachel', 'Start/Stop-systeem', 'Stuurwielverwarming', 'Traction Control', 'Verblindingsvrij grootlicht', 'Vermoeidheids herkenning'],
    'Overige': ['100% dealeronderhouden', '1e eigenaar', '2e eigenaar', '3e eigenaar', '4x4 aandrijving', '4x4 uitvoering', '50 kWh accu', '60 kWh accu', '7 persoons', '8 personen', 'All-season banden', 'Automaat', 'Automatische transmissie 4-traps', 'Automatische transmissie 5-traps', 'Automatische transmissie 6-traps', 'Automatische transmissie 7-traps', 'Automatische transmissie 8-traps', 'Aventurijnzilver metallic', 'Bakwagen', 'Bedrijfswagen', 'Betimmering', 'Biodiesel conversie', 'Blauwe kleur', 'Bosch accumodule', 'Brandstofcel', 'Brommobiel', 'BSM systeem', 'Cabriolet', 'Camper uitvoering', 'Centrale deurvergrendeling met afstandsbediening', 'Centrale vergrendeling', 'Chiptuning', 'Compleet dealeronderhouden', 'CNG', 'Combi', 'Compliance pakket', 'Courier pakket', 'Cruise controle', 'DAB+', 'Dakkoffer', 'Designo lakafwerking', 'Diesel', 'Dubbel lucht', 'Durello velg', 'Elektrisch bedienbaare trekhaak', 'Elektrisch verstelbare buitenspiegels', 'Elektrische laadaansluiting', 'Elektrische ramen voor en achter', 'Elektrische spiegels', 'Elektronische parkeerrem', 'Elektroauto', 'Europese variant', 'Flexi hood', 'Gedeeltelijk elektrisch rijden', 'Getint glas', 'Grijs metallic', 'Handgeschakeld', 'Hoekbank links/rechts', 'Hooggeplaatste derde remlicht', 'Hybrid', 'Hydrauliek', 'Indrubberen koppeling', 'Katalysator', 'Keuringsbewijzen aanwezig', 'Kever cabriolet', 'Klaar voor bezichtiging', 'Kleur: aural zwart', 'Luxury car package', 'Magazijnaccessoires', 'Mat groene kleur', 'Metaalkleur', 'Metallic lak', 'Micro camper', 'Milieu markeringen', 'Motorvermogen: 136 PK', 'Move goedkeuring', 'Muntgroene metallic', 'Navigatiesysteem full map + hard disk', 'Neerklapbare passagiersstoel', 'Netto catalogusprijs €62.154,-', 'Nieuwwaarde €110.000', 'Ombouw tot kampeerauto', 'Opknapper', 'Optioneel Achteruitrijcamera', 'Origineel 127.000 KM', 'Originele kentekenplaten', 'Orionblauw metallic', 'Overige dealers', 'Pakket systemen', 'Parkeerhulp', 'Per direct beschikbaar', 'Persluchtinstallatie', 'Plug-in-hybrid', 'Practical comfort-pakket', 'Privacy glass', 'Range extender', 'Rechtsgestuurd', 'Regensensor', 'Retro & Oldtimer', 'Rijstrooksensor', 'Rode exterieurkleur', 'Rokers-auto', 'Ruime laadruimte', 'Scandinavian Edition', 'Schuifdeur links', 'Schuifdeur rechts', 'Sfeerverlichting', 'Smoke knipperlicht', 'Snow edition', 'Special paint khaki green', 'Speelgoed', 'Sport chassis', 'Sport-uitvoering', 'Sterling zilver', 'Stoffering', 'Stuur bekrachtigd', 'Summer performance', 'Systeemnavigatie', 'Telefoon voorbereiding Bluetooth', 'Terreinvelgen', 'Trekhaak', 'Truckmodule', 'Uitgebreide dealergeschiedenis', 'USB', 'Van', 'Van Hool Touring', 'Verdikte olie', 'Vermogen: 55 kW', 'Versterkte veren achteras', 'Volautomatisch', 'Volkswagens Jetta', 'Voorstoelen in hoogte verstelbaar', 'Voorzien van trekhaak', 'Winter banden', 'Zwarte metallic', 'Zoom module'],
};

function generateSlug(...parts) {
    const rawSlug = parts.filter(Boolean).map(part =>
        part.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    ).join('-');

    return rawSlug.replace(/^-+/, '');
}

function categorizeAccessories(accessories) {
  const categorized = {};
  Object.keys(accessoryCategories).forEach(category => {
      categorized[category] = [];
  });

  accessories.split(',').forEach(accessory => {
      accessory = accessory.trim().toLowerCase();
      let foundCategory = false;

      Object.entries(accessoryCategories).forEach(([category, keywords]) => {
          if (keywords.some(keyword => keyword.toLowerCase() === accessory)) {
              categorized[category].push({ name: accessory });
              foundCategory = true;
          }
      });

      // If no category was found for this accessory, add it to 'Overige'
      if (!foundCategory) {
          categorized.Overige.push({ name: accessory });
      }
  });

  return categorized;
}


// Function to convert an array of accessories into a delimited string
function convertAccessoriesToString(accessories) {
  return accessories.map(accessory => accessory.name).join(', '); // You can change the delimiter if needed
}

function saveUniqueValue(tableName, fieldName, value, callback) {
    if (!value) {
        callback(null, null);
        return;
    }

    base(tableName).select({
        filterByFormula: `{${fieldName}} = "${value}"`,
        maxRecords: 1
    }).firstPage(function (err, records) {
        if (err) {
            console.error(err);
            callback(err);
            return;
        }
        if (records.length === 0) {
            let fields = {};
            fields[fieldName] = value;
            base(tableName).create([{ fields }], function (err, records) {
                if (err) {
                    console.error(err);
                    callback(err);
                    return;
                }
                console.log(`Unique value "${value}" saved in "${tableName}".`);
                callback(null, records[0].getId());
            });
        } else {
            console.log(`Value "${value}" already exists in "${tableName}". No need to save again.`);
            callback(null, records[0].getId());
        }
    });
}

function checkIfKentekenExists(kenteken, callback) {
    base('Integrations').select({
        filterByFormula: `{Kenteken} = "${kenteken}"`,
        maxRecords: 1
    }).firstPage(function (err, records) {
        if (err) {
            console.error(err);
            callback(err, false);
            return;
        }
        callback(null, records.length > 0);
    });
}

function saveDataToAirtable(formData, callback) {
      // Categorize accessories
    const categorizedAccessories = categorizeAccessories(formData.accessoires);
    const accessoriesInterieur = convertAccessoriesToString(categorizedAccessories.Interieur);
    const accessoriesExterieur = convertAccessoriesToString(categorizedAccessories.Exterieur);
    const accessoriesInfotainment = convertAccessoriesToString(categorizedAccessories.Infotainment);
    const accessoriesMilieu = convertAccessoriesToString(categorizedAccessories.Milieu);
    const accessoriesVeiligheid = convertAccessoriesToString(categorizedAccessories.Veiligheid);
    const accessoriesOverige = convertAccessoriesToString(categorizedAccessories.Overige);

    checkIfKentekenExists(formData.kenteken, (err, exists) => {
        if (err) {
            callback(err);
            return;
        }

        if (exists) {
            console.log(`Record with kenteken "${formData.kenteken}" already exists. Not saving duplicate.`);
            callback(null, 'duplicate');
            return;
        }

        const categoryFields = [
            { tableName: 'Merk', fieldName: 'Name', value: formData.merk },
            { tableName: 'Bouwjaar', fieldName: 'Name', value: formData.bouwjaar },
            { tableName: 'Brandstof', fieldName: 'Name', value: formData.brandstof },
            { tableName: 'Transmissie', fieldName: 'Name', value: formData.transmissie }
        ];

        const categorizedAccessories = categorizeAccessories(formData.accessoires);

        const saveCategoryAndGetId = ({ tableName, fieldName, value }) => new Promise((resolve, reject) => {
            saveUniqueValue(tableName, fieldName, value, (err, recordId) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ tableName, id: recordId });
                }
            });
        });

        Promise.all(categoryFields.map(saveCategoryAndGetId))
            .then(uniqueValues => {
                var imageUrls = formData.afbeeldingen.split(',').filter(Boolean).map(url => url.trim());

                var recordData = {
                    Name: `${formData.merk} ${formData.model} ${formData.type}`,
                    Slug: generateSlug(formData.merk, formData.model, formData.type),
                    Voertuignr_hexon: parseInt(formData.voertuignr_hexon),
                    Kenteken: formData.kenteken,
                    Verkoopprijs_particulier_bedrag: parseInt(formData.verkoopprijs_particulier_bedrag),
                    Verkoopprijs_particulier_munteenheid: formData.verkoopprijs_particulier_munteenheid,
                    Tellerstand: parseInt(formData.tellerstand),
                    Merk: formData.merk,
                    Brandstof: formData.brandstof,
                    Model: formData.model,
                    Inrichting: formData.carrosserie,
                    Aantal_deuren: parseInt(formData.aantal_deuren),
                    Uitvoering: formData.type,
                    Laksoort: formData.laksoort,
                    Vermogen_motor_kw: parseInt(formData.vermogen_motor_kw),
                    Vermogen_motor_pk: parseInt(formData.vermogen_motor_pk),
                    Wielbasis: parseInt(formData.wielbasis),
                    Toerental_max_vermogen: 0,
                    Toerental_max_koppelkracht: 0,
                    Max_koppelkracht: parseInt(formData.koppel),
                    Turbo: false,
                    Aantal_cilinders: parseInt(formData.aantal_cilinders),
                    Lengte: parseInt(formData.lengte),
                    Breedte: parseInt(formData.breedte),
                    Hoogte: parseInt(formData.hoogte),
                    Aantal_zitplaatsen: parseInt(formData.aantal_zitplaatsen),
                    Bouwjaar: formData.bouwjaar,
                    Kleur: formData.basiskleur,
                    Transmissie: formData.transmissie,
                    Cilinderinhoud: parseInt(formData.cilinderinhoud),
                    Gewicht: parseInt(formData.massa),
                    Max_treklast_geremd: parseInt(formData.max_trekgewicht),
                    Max_treklast_ongeremd: parseInt(formData.max_trekgewicht_ongeremd),
                    Wielaandrijving: "",
                    Gemiddeld_verbruik: parseFloat(formData.gemiddeld_verbruik),
                    Topsnelheid: parseInt(formData.topsnelheid),
                    CO2_emissie: parseInt(formData.co2_uitstoot),
                    LPG_G3_indicatie: false,
                    APK: formData.apk_tot,
                    BTW_Marge: formData.btw_marge,
                    Wegenbelasting_kwartaal_min: parseInt(formData.wegenbelasting_kwartaal_min),
                    Wegenbelasting_kwartaal_max: parseInt(formData.wegenbelasting_kwartaal_max),
                    Bijtelling_percentage: formData.bijtelling_pct,
                    Onderhoudsboekjes: formData.onderhoudsboekjes,
                    Financial_Lease: "",
                    Foto: imageUrls.slice(1).map(url => ({ url })),
                    Thumbnail: imageUrls.length > 0 ? [{ url: imageUrls[0] }] : [],
                    Opmerkingen: formData.standaardopmerkingen,
                    Accessories_Interieur: accessoriesInterieur,
                    Accessories_Exterieur: accessoriesExterieur ,
                    Accessories_Infotainment: accessoriesInfotainment,
                    Accessories_Milieu: accessoriesMilieu,
                    Accessories_Veiligheid: accessoriesVeiligheid,
                    Accessories_Overige: accessoriesOverige,
                };

                uniqueValues.forEach(({ tableName, id }) => { 
                  if (id) {
                    switch (tableName) {
                        case 'Merk':
                            recordData.Merk = [id];
                            break;
                        case 'Bouwjaar':
                            recordData.Bouwjaar = [id];
                            break;
                        case 'Brandstof':
                            recordData.Brandstof = [id];
                            break;
                        case 'Transmissie':
                            recordData.Transmissie = [id];
                            break;
                        // Add cases for other category tables if necessary
                    }
                }
            });

            // Create new record in Integrations table
            base('Integrations').create([{ fields: recordData }], function (err, integrationRecords) {
                if (err) {
                    console.error(err);
                    callback(err);
                    return;
                }
                console.log('Integration record saved with ID:', integrationRecords[0].getId());
                callback(null, integrationRecords[0].getId());
            });
        })
        .catch(err => {
            console.error('Error saving categories:', err);
            callback(err);
        });
});
}

// Define a simple route
app.post('/', (req, res) => {
res.send('Hello, World!');
});

// Define a route to handle POST requests with form data
app.post('/api/data', (req, res) => {
const formData = req.body;

// Map the form data codes to their full descriptions before saving/updating/deleting
formData.transmissie = transmissieMapping[formData.transmissie];
formData.brandstof = brandstofMapping[formData.brandstof];
formData.btw_marge = BTW_Marge[formData.btw_marge];

// Categorize accessories
const categorizedAccessories = categorizeAccessories(formData.accessoires);
const accessoriesInterieur = convertAccessoriesToString(categorizedAccessories.Interieur);
const accessoriesExterieur = convertAccessoriesToString(categorizedAccessories.Exterieur);
const accessoriesInfotainment = convertAccessoriesToString(categorizedAccessories.Infotainment);
const accessoriesMilieu = convertAccessoriesToString(categorizedAccessories.Milieu);
const accessoriesVeiligheid = convertAccessoriesToString(categorizedAccessories.Veiligheid);
const accessoriesOverige = convertAccessoriesToString(categorizedAccessories.Overige);

// Generate the Name field for searching/updating/deleting
const name = `${formData.merk} ${formData.model} ${formData.type}`;

if (formData.actie === 'add') {
    // Save the received form data to Airtable
    saveDataToAirtable(formData, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Failed to save data to Airtable.' });
        } else if (result === 'duplicate') {
            res.status(409).json({ message: 'Duplicate data. Record with the same kenteken already exists.' });
        } else {
            res.status(201).json({ message: 'Form data received and saved successfully' });
        }
    });
} else if (formData.actie === 'delete') {
    // Delete the corresponding record from Airtable
    base('Integrations').select({
        filterByFormula: `{Voertuignr_hexon} = "${formData.voertuignr_hexon}"`,
        maxRecords: 1
    }).firstPage(function (err, records) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to find record in Airtable.' });
            return;
        }
        if (records.length > 0) {
            const recordId = records[0].getId();
            base('Integrations').destroy(recordId, function (err, deletedRecord) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Failed to delete record from Airtable.' });
                    return;
                }
                console.log(`Record with ID ${recordId} deleted.`);
                res.status(200).json({ message: 'Record deleted successfully.' });
            });
        } else {
            res.status(404).json({ error: 'Record not found in Airtable.' });
        }
    });
} else if (formData.actie === 'change') {
    // Update the corresponding record in Airtable
    base('Integrations').select({
        filterByFormula: `{Voertuignr_hexon} = "${formData.voertuignr_hexon}"`,
        maxRecords: 1
    }).firstPage(function (err, records) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to find record in Airtable.' });
            return;
        }
        if (records.length > 0) {
            const recordId = records[0].getId();

            // Prepare updated data
            const updatedData = {
                Name: formData.merk + ' ' + formData.model + ' ' + formData.type,
                Slug: generateSlug(formData.merk, formData.model, formData.type),
                Voertuignr_hexon: parseInt(formData.voertuignr_hexon),
                Kenteken: formData.kenteken,
                Verkoopprijs_particulier_bedrag: parseInt(formData.verkoopprijs_particulier_bedrag),
                Verkoopprijs_particulier_munteenheid: formData.verkoopprijs_particulier_munteenheid,
                Tellerstand: parseInt(formData.tellerstand),
                Merk: formData.merk,
                Brandstof: formData.brandstof,
                Model: formData.model,
                Inrichting: formData.carrosserie,
                Aantal_deuren: parseInt(formData.aantal_deuren),
                Uitvoering: formData.type,
                Laksoort: formData.laksoort,
                Vermogen_motor_kw: parseInt(formData.vermogen_motor_kw),
                Vermogen_motor_pk: parseInt(formData.vermogen_motor_pk),
                Wielbasis: parseInt(formData.wielbasis),
                Toerental_max_vermogen: 0,
                Toerental_max_koppelkracht: 0,
                Max_koppelkracht: parseInt(formData.koppel),
                Turbo: false,
                Aantal_cilinders: parseInt(formData.aantal_cilinders),
                Lengte: parseInt(formData.lengte),
                Breedte: parseInt(formData.breedte),
                Hoogte: parseInt(formData.hoogte),
                Aantal_zitplaatsen: parseInt(formData.aantal_zitplaatsen),
                Bouwjaar: formData.bouwjaar,
                Kleur: formData.basiskleur,
                Transmissie: formData.transmissie,
                Cilinderinhoud: parseInt(formData.cilinderinhoud),
                Gewicht: parseInt(formData.massa),
                Max_treklast_geremd: parseInt(formData.max_trekgewicht),
                Max_treklast_ongeremd: parseInt(formData.max_trekgewicht_ongeremd),
                Wielaandrijving: "",
                Gemiddeld_verbruik: parseFloat(formData.gemiddeld_verbruik),
                Topsnelheid: parseInt(formData.topsnelheid),
                CO2_emissie: parseInt(formData.co2_uitstoot),
                LPG_G3_indicatie: false,
                APK: formData.apk_tot,
                BTW_Marge: formData.btw_marge,
                Wegenbelasting_kwartaal_min: parseInt(formData.wegenbelasting_kwartaal_min),
                Wegenbelasting_kwartaal_max: parseInt(formData.wegenbelasting_kwartaal_max),
                Bijtelling_percentage: formData.bijtelling_pct,
                Onderhoudsboekjes: formData.onderhoudsboekjes,
                Financial_Lease: "",
                Foto: formData.afbeeldingen.split(',').slice(1).map(url => ({ url: url.trim() })),
                Thumbnail: formData.afbeeldingen.length > 0 ? [{ url: formData.afbeeldingen.split(',')[0] }] : [],
                Opmerkingen: formData.standaardopmerkingen,
                Accessories_Interieur: accessoriesInterieur,
                Accessories_Exterieur: accessoriesExterieur ,
                Accessories_Infotainment: accessoriesInfotainment,
                Accessories_Milieu: accessoriesMilieu,
                Accessories_Veiligheid: accessoriesVeiligheid,
                Accessories_Overige: accessoriesOverige,
            };

            base('Integrations').update(recordId, { fields: updatedData }, function (err, updatedRecord) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Failed to update record in Airtable.' });
                    return;
                }
                console.log(`Record with ID ${recordId} updated.`);
                res.status(200).json({ message: 'Record updated successfully.' });
            });
        } else {
            res.status(404).json({ error: 'Record not found in Airtable.' });
        }
    });
} else {
    res.status(400).json({ error: 'Invalid action specified.' });
}
});

// Start the server
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});
