/**
 * Extracts data from wikipedia HTML table
 */

const TABLE_IDS = {
  "American Samoa": "6E71B72E-4F2F-495D-9225-A6634E6C2EB1",
  "Black Canyon of the Gunnison":"BDBD573F-97EF-44E7-A579-471679F2C42A",
  "Bryce Canyon":"6B1D053D-714F-46D1-B410-04BE868F14C1",
  "Canyonlands":"319E07D8-E176-41F8-98A9-1E3F8099D0AB",
  "Capitol Reef":"2F05E2B8-CDA3-434E-9C4C-C7DD828CAC3B",
  "Carlsbad Caverns *":"6FDE39B1-AB4A-4C9A-A5CD-4AF67601CD78",
  "Channel Islands":"5595FC7A-F218-4439-8D2E-F47449838820",
  "Congaree":"EEBA7225-7FF5-4B62-B60C-6BBC66351A4E",
  "Denali":"C0BF2A42-E353-4FAE-B4C4-AA0676B58100",
  "Gateway Arch":"BD588493-EC77-4B97-B73E-3BA444864DC5",
  "Glacier Bay":"3682DBDE-6746-4979-86CC-2358C5B72661",
  "Glacier":"2B5178C6-2446-488C-AC31-47E3CEBF7159",
  "Grand Canyon *":"B7FF43E5-3A95-4C8E-8DBE-72D8608D6588",
  "Great Basin":"4C1A549B-080F-4522-9CA7-67BB5A0845CA",
  "Great Smoky Mountains":"D9819727-18DF-4A84-BDDE-D4F2696DE340",
  "Haleakal":"4930BAEB-A3BF-4825-9796-DCD0FD1C3BD5",
  "Hawaii Volcanoes":"D9BF4288-9AC3-4526-9598-BE8920839ACC",
  "Hot Springs":"ED9C0322-68FB-4DE1-A884-61C623281C9D",
  "Indiana Dunes":"473EFACE-EE15-4A4F-AA6C-666810A9E27D",
  "Isle Royale":"0F6893CF-FC15-4AC5-8C95-E70FC9C21B1A",
  "Joshua Tree":"F5CD58FB-05DC-4074-99DA-F327A537F1BC",
  "Katmai":"B712CB0C-B3DD-48A6-AA4F-CCD72C87F48B",
  "Kobuk Valley":"691831BF-F280-4E02-BF4A-FF476BC66B23",
  "Lake Clark":"5F76F85B-23F4-4616-AA0B-A26E8DE76593",
  "Lassen Volcanic":"9AA4A53C-0331-43CC-99F5-379BC929FFB2",
  "Mammoth Cave":"6A1737A1-6848-4087-AAF7-68A427247357",
  "Mesa Verde *":"BE3A981E-BB55-474D-8A0E-D711408682DC",
  "Mount Rainier":"07229CB8-8533-4669-B614-2B884779DD93",
  "North Cascades":"80EB184D-4B6D-4AD2-B6E2-CAAD6312B27D",
  "New River Gorge":"28F155F2-5116-4E4F-9E21-E8CBCFA5FF49",
  "Olympic":"81CFE898-AD06-4C0D-8A9B-C8D356273F0D",
  "Petrified Forest":"1ABD0EFF-AC09-4EA1-8CC1-2351A3E160D0",
  "Rocky Mountain":"67A56B17-F533-4A56-B2DA-26091C6AD295",
  "Saguaro":"A6F169CF-B830-499C-A5EB-A35138C77589",
  "Sequoia":"7E5A693C-2F63-44FD-B791-31FC8B8B6285",
  "Voyageurs":"859727CB-2812-40DF-B8DB-D4AE9EA00089",
  "Wind Cave":"37C48EE0-2881-4D22-8F91-A249AE3B0CD0",
  "Acadia":"6DA17C86-088E-4B4D-B862-7C1BD5CF236B",
  "Arches":"36240051-018E-4915-B6EA-3F1A7F24FBE4",
  "Badlands":"B170CCF7-7AB9-48FF-950E-31815FD4DBB2",
  "Big Bend":"C9056F71-7162-4208-8AE9-2D0AEFA594FD",
  "Biscayne":"FBF9F793-5114-4B61-A5BA-6F9ADDFDF459",
  "Crater Lake":"7DC1050A-0DDE-4EF9-B777-3C9349BCC4DE",
  "Cuyahoga Valley":"F4D44F29-3F67-498F-B05B-0783473D2708",
  "Death Valley":"FFC9F9C4-D79D-4CA7-AB0F-7A2AD30061CD",
  "Dry Tortugas":"167A05D1-5793-49E0-89FE-0A1DDFA9A7F4",
  "Everglades":"5EA02193-276A-4037-B7DB-5765A56935FD",
  "Gates of the Arctic":"BC195D18-71C8-4A99-BF8E-10BFAB849679",
  "Grand Teton":"FF73E2AA-E274-44E1-A8F5-9DD998B0F579",
  "Great Sand Dunes":"461D40CC-4379-4C1B-ADB8-3563147F61A1",
  "Guadalupe Mountains":"6510001B-685D-4688-A963-4ECE7AB609DB",
  "Kenai Fjords":"11E73438-0CCC-4441-A76A-1995F67F2D89",
  "Pinnacles":"9B266961-3364-43D2-9A08-82BB5EF5643F",
  "Redwood *":"041B325C-A34F-4027-8E41-1DF3F9A1D799",
  "Kings Canyon":"7E5A693C-2F63-44FD-B791-31FC8B8B6285",
  "Shenandoah":"E991C8BC-C203-4A09-AFD5-87380CF5C387",
  "Theodore Roosevelt":"B5FE5682-7981-47DD-AC96-13F4B33A466E",
  "Virgin Islands":"C65070FE-942C-4E00-8C2B-64CA33C85B4A",
  "White Sands":"32D2B528-193E-43FA-BF38-32493D9E317D",
  "WrangellSt.Elias *":"B7944940-3FE5-4F9B-80AB-2FD78A4CDD48",
  "Yellowstone":"F58C6D24-8D10-4573-9826-65D42B8B83AD",
  "Yosemite *":"4324B2B4-D1A3-497F-8E6B-27171FAE4DB2",
  "Zion":"41BAB8ED-C95F-447D-9DA1-FCC4E4D808B2"
}

const tableRows = [];
const headers = ['name', 'image', 'location', 'date_established', 'area', 'visitors', 'description']

const defaultExtract = el => $(el).text().split("\n")[0]

// Functions to get each piece of data
const extractors = {
  name: el => $(el).text().replace(/\s+$/, '').replace(/[^\x00-\x7F]/g, ""),
  image: el => 'https:' + $('img', el).attr('src'),
  location: el => $(el).text().split(/\d/)[0],
  date_established: defaultExtract,
  area: defaultExtract,
  visitors: defaultExtract,
  description(el) {
    $('sup', el).remove()
    return $(el).text()
  }
}

// Iterate over each row
$('table tbody tr').each(function() {
  const row = {};

  // Iterate through each data point and run through extractor function, add to object
  $('th, td', this).each(function(idx) {
    const header = headers[idx]
    row[header] = extractors[header](this)
  })

  // Append object to outer rows variable
  tableRows.push({ ...row, id: TABLE_IDS[row.name] })
})

console.log(tableRows)

/**
 * Extracts data from csv
 */

const CSV_TO_WIKI_NAMES = {
  "National Park of American Samoa": "American Samoa",
  "Black Canyon of the Gunnison NP": "Black Canyon of the Gunnison",
  "Bryce Canyon NP": "Bryce Canyon",
  "Canyonlands NP": "Canyonlands",
  "Capitol Reef NP": "Capitol Reef",
  "Carlsbad Caverns NP": "Carlsbad Caverns *",
  "Channel Islands NP": "Channel Islands",
  "Congaree NP": "Congaree",
  "Denali NP & PRES": "Denali",
  "Gateway Arch NP": "Gateway Arch",
  "Glacier Bay NP & PRES": "Glacier Bay",
  "Glacier NP": "Glacier",
  "Grand Canyon NP": "Grand Canyon *",
  "Great Basin NP": "Great Basin",
  "Great Smoky Mountains NP": "Great Smoky Mountains",
  "Haleakala NP": "Haleakal",
  "Hawaii Volcanoes NP": "Hawaii Volcanoes",
  "Hot Springs NP": "Hot Springs",
  "Indiana Dunes NP": "Indiana Dunes",
  "Isle Royale NP": "Isle Royale",
  "Joshua Tree NP": "Joshua Tree",
  "Katmai NP & PRES": "Katmai",
  "Kobuk Valley NP": "Kobuk Valley",
  "Lake Clark NP & PRES": "Lake Clark",
  "Lassen Volcanic NP": "Lassen Volcanic",
  "Mammoth Cave NP": "Mammoth Cave",
  "Mesa Verde NP": "Mesa Verde *",
  "Mount Rainier NP": "Mount Rainier",
  "New River Gorge NR": "New River Gorge",
  "North Cascades NP": "North Cascades",
  "Olympic NP": "Olympic",
  "Petrified Forest NP": "Petrified Forest",
  "Rocky Mountain NP": "Rocky Mountain",
  "Saguaro NP": "Saguaro",
  "Sequoia NP": "Sequoia",
  "Voyageurs NP": "Voyageurs",
  "Wind Cave NP": "Wind Cave",
  "Acadia NP": "Acadia",
  "Arches NP": "Arches",
  "Badlands NP": "Badlands",
  "Big Bend NP": "Big Bend",
  "Biscayne NP": "Biscayne",
  "Crater Lake NP": "Crater Lake",
  "Cuyahoga Valley NP": "Cuyahoga Valley",
  "Death Valley NP": "Death Valley",
  "Dry Tortugas NP": "Dry Tortugas",
  "Everglades NP": "Everglades",
  "Gates of the Arctic NP & PRES": "Gates of the Arctic",
  "Grand Teton NP": "Grand Teton",
  "Great Sand Dunes NP & PRES": "Great Sand Dunes",
  "Guadalupe Mountains NP": "Guadalupe Mountains",
  "Kenai Fjords NP": "Kenai Fjords",
  "Pinnacles NP": "Pinnacles",
  "Redwood NP": "Redwood *",
  "Kings Canyon NP": "Kings Canyon",
  "Shenandoah NP": "Shenandoah",
  "Theodore Roosevelt NP": "Theodore Roosevelt",
  "Virgin Islands NP": "Virgin Islands",
  "White Sands NP": "White Sands",
  "Wrangell-St. Elias NP & PRES": "WrangellSt.Elias *",
  "Yellowstone NP": "Yellowstone",
  "Yosemite NP": "Yosemite *",
  "Zion NP":"Zion"
}

let csvResults, allParks, finalResults;

async function getFinalResults() {
  csvResults = await d3.csv("sept-2020-visits.csv", row => {
    row.current_month = Number(row.current_month.replaceAll(',', ''))
    row.current_ytd = Number(row.current_ytd.replaceAll(',', ''))
    row.month_diff = Number(row.month_diff.replaceAll(',', ''))
    row.previous_month = Number(row.previous_month.replaceAll(',', ''))
    row.previous_ytd = Number(row.previous_ytd.replaceAll(',', ''))
    row.ytd_diff = Number(row.ytd_diff.replaceAll(',', ''))
    row.id = TABLE_IDS[CSV_TO_WIKI_NAMES[row.park]]
    return row
  })


  allParks = await d3.json("all_parks.json", row => row)
  console.log(typeof(allParks))
//  filteredParks = [...allParks]
  const parksById = allParks.data.reduce((obj, r) => ({ ...obj, [r.id]: r }), {})

  const csvResultsById = csvResults.reduce((obj, r) => ({ ...obj, [r.id]: r }), {})
  finalResults = tableRows.map(row => ({
    ...row,
    ...csvResultsById[row.id],
    ...parksById[row.id]
  }))

  // console.log(_)
  console.log(JSON.stringify(finalResults))
}

getFinalResults()