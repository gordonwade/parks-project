let allData, activitySets, activityMapVis, parkActivityScores, barVis, r, miniRadarCharts;

let sharedGreen = '#28794C';
let sharedBlue = '#333577';
let sharedYellow = '#FFC900';
let sharedRed = '#AE0000';
let sharedGrey = '#D3D3D3';
let sharedLightBlue = '#6150D8';

let palette = [sharedBlue, sharedYellow, sharedRed];
let color = d3.scaleOrdinal().range([sharedBlue, sharedYellow, sharedRed]);

let radarChartOptionsLarge = {
    w: 800,
    h: 600,
    // margin: margin,
    maxValue: 1,
    levels: 6,
    roundStrokes: true,
    color: color,
    strokeWidth: 2,
    legend: true,
    title: 'Your Top Three Parks: Activity Profile Comparison',
};

let radarChartOptionsSmall = {
    w: 200,
    h: 200,
    margin: { top: 50, bottom: 100, left: 60, right: 60 },
    maxValue: 1,
    levels: 3,
    roundStrokes: true,
    color: color,
    strokeWidth: 2,
    labelFactor: 1.4,
};

const MONTHS_SHORT = ['', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
const SEASONS = {
    All: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    Spring: [3, 4, 5],
    Summer: [6, 7, 8],
    Fall: [9, 10, 11],
    Winter: [12, 1, 2],
};

d3.json('data/cleaned_data.json').then(async (data) => {
    // Normalize visit numbers data structures
    allData = data.map(function (d) {
        const monthlyVisits = _.fromPairs(
            Object.entries(d['monthly visit']).map(([k, v]) => [
                k,
                { prev: v[`${k} 2019`], current: v[`${k} 2020`], monthIdx: MONTHS_SHORT.indexOf(k) },
            ]),
        );

        const ytdVisits = _.fromPairs(
            Object.entries(d['monthly visit']).map(([k, v]) => [
                MONTHS_SHORT.findIndex[k],
                { prev: v[`YTD ${k}`], current: v[`YTD ${k}`], monthIdx: MONTHS_SHORT.indexOf(k) },
            ]),
        );
        const seasonalVisits = _.fromPairs(
            Object.entries(SEASONS).map(([k, v]) => [
                k,
                _.meanBy(_.compact(v.map((i) => monthlyVisits[MONTHS_SHORT[i]])), 'current'),
            ]),
        );

        // Get rid of NaNs--some parks do not have all monthly data, missing ones are NaNs
        // Round the averages
        Object.keys(seasonalVisits).forEach((s) => {
            if (isNaN(seasonalVisits[s])) {
                seasonalVisits[s] = 0;
            }
            seasonalVisits[s] = Math.round(seasonalVisits[s]);
        });

        return {
            ...d,
            monthlyVisits,
            ytdVisits,
            seasonalVisits,
        };
    });

    filteredParks = [...allData];

    d3.json('data/timeline_data.json').then((timelineData) => {
        const formattedParks = allData.map((p) => ({
            year: Number(p.date_established.split(', ')[1]),
            image: p.images[0].url,
            title: `${p.fullName} Founded`,
            description: p.description,
            isPark: true,
        }));
        new Timeline('timeline', _.orderBy(timelineData.concat(formattedParks), 'year'));
    });

    initActivitySelect();
    activitySets = await d3.json('data/activity_sets.json');
    prepareData();
    barVis = new BarChart('bar', allData);
    initResults();
});

d3.json('data/hex_cartogram_data.json').then((data) => {
    let hexMap = new HexMap('hex-map', data);
});

function prepareData() {
    parkActivityScores = [];

    allData.forEach((d) => {
        let activityScores = [];
        activitySets.forEach((a) => {
            let activitySet = new Set(a.activities);
            let matchSummary = setScore(activitySet, d.activities);
            activityScores.push({
                parkName: d.name,
                axis: a.name,
                value: matchSummary.score,
                matchingActivities: matchSummary.matchingActivities,
                numberMatching: matchSummary.numberMatching,
            });
        });

        let parkData = { parkName: d.name, activities: d.activities, activityScores: activityScores };
        if (parkActivityScores.map((d) => d.parkName).indexOf(d.name) == -1) {
            parkActivityScores.push(parkData);
        }
    });

    initRadar();
}

function initRadar() {
    let displayParks;
    // console.log(topTenParks.slice(0,3).map(d => d.name));
    if (topTenParks.length != 0) {
        displayParks = parkActivityScores.filter((d) => {
            return (
                topTenParks
                    .slice(0, 3)
                    .map((d) => d.name)
                    .indexOf(d.parkName) != -1
            );
        });
    } else {
        displayParks = parkActivityScores.sort(() => Math.random() - 0.5).slice(0, 3);
    }

    r = new RadarChartClass('.radarChart', displayParks, radarChartOptionsLarge);

    miniRadarCharts = [];
    for (let i = 0; i < 3; i++) {
        let customOptions = radarChartOptionsSmall;
        customOptions.color = d3.scaleOrdinal().range([palette[i]]);
        miniRadarCharts.push(new RadarChartClass('.radarChart' + (i + 1), displayParks, customOptions, i, i + 1));
    }

    // Populate category-->activities hidden table
    table = document.getElementById('category-activities');
    activitySets.forEach((c) => {
        let row = table.insertRow(-1);
        row.insertCell(0).innerHTML = c.name;

        let category_list = '';
        c.activities.forEach((a) => (category_list += `${a}<br>`));

        row.insertCell(1).innerHTML = `<details><summary>See list</summary>${category_list}</details>`;
    });
}

function updateRadar() {
    r.updateVis();
    miniRadarCharts.forEach((d) => d.updateVis());
}

function setScore(set, activities) {
    let matchingActivities = [];
    let score = 0;

    if (!activities) {
        console.log("You've found the most boring place on earth, with literally NO activities");
    } else {
        activities.forEach((d) => {
            if (set.has(d.name)) {
                score += 1;
                matchingActivities.push(d);
            }
        });
    }
    return { numberMatching: score, score: score / set.size, matchingActivities: matchingActivities };
}

$(document).ready(function () {
    setTimeout(function () {
        $('#read-instructions').show();
        $('.all-content').hide();
    }, 2000);
    $('#read-instructions').click(function () {
        $(this).hide();
        $('.all-content').show();
    });
});
