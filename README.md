## CS171: Visualization

### US National Parks

Visualization Fall 2020 Course Final Project

---

This repository contains a fork of our final project for CS171. The purpose of this fork is for additional personal 
experimentation and development, without disturbing the original state of the completed project. To view this project in
its current state, please visit: 
[https://gordonwade.github.io/parks-project/presentation/](https://gordonwade.github.io/parks-project/presentation/) 

To view the original project materials, please see:

Website: [https://tashrifbillah.github.io/vis-final-project/presentation/](https://tashrifbillah.github.io/vis-final-project/presentation/)

Video: [https://youtu.be/oAY_QPBDq_0](https://youtu.be/oAY_QPBDq_0)

By Gordon Wade, Nate Mortensen, and Tashrif Billah

Harvard University

Department of Computer Science


### Background
2020 has been a challenging year for many people. The COVID-19 pandemic has altered daily life in many ways and has made
it difficult for to engage in many recreational activities. One thing that has remained consistent throughout this time 
is that open outdoor spaces offer a safer alternative to indoor activities, while promoting physical activity. 
Fortunately, the United States is home to an incredibly varied and and beautiful landscape. This is made even more 
accessible by the National Parks System.

Our project begins with an exploration of the effect that the pandemic has had on visitations to the National Parks, and
follows this with a general exploration of the history and location of National Parks throughout the country. Finally, 
we guid the user through a selection process and use their preferences to identify the most relevant parks for their 
location and interests. We hope that this will encourage users to explore and appreciate these great natural resources!

### Technical Summary

#### Data Sources and Cleaning
We sourced data from several distinct locations for this project:
- [National Parks Service History](https://www.nps.gov/parkhistory/hisnps/NPSHistory/timeline_annotated.htm)
- [National Parks Service STATS](https://irma.nps.gov/STATS/Reports/National)
- [National Parks Service API](https://www.nps.gov/subjects/developer/index.htm)
- [Wikipedia](https://en.wikipedia.org/wiki/List_of_national_parks_of_the_United_States)

The data is present within the `data-cleaning`, `data-monthly-cleaned`, and `data_exploration` directories, along with 
several scripts we created to help clean and organize this data. The final data objects used in the project are 
available within the `presentation/data` directory.

#### Code and Views
The remainder of our code for this project is available in standardized locations within the `presentation` directory. 
The `index.html` file contains our HTML, and the `js` and `css` subdirectories contain the javascript and css stylesheets
that we created.

We do also include `d3-tip.js`, a borrowed piece of code that is credited to Justin Palmer, with subsequent updates by 
Constantin Gavrilete and David Gotz. Additionally, other libraries were imported directly for use. Among these is 
`d3-hexbin`, which was instrumental in construction of the hexagonal map representation of the United States.

For DOM manipulation, we relied on d3 for visualizations, jQuery for basic functionality, and VueJS for a couple areas
requiring advanced DOM manipulation and/or lots of templating.

#### Interface
We aimed for the interface and user experience to be self-explanatory, but it is worth a brief summary as well. The 
project begins with a series of standalone visualizations. Each of these visualizations provides context or insight on a 
different aspect of the parks and our story. Each visualization includes its own interactive components, but they do not
share any filters or overall architecture.

Beginning with section 2, we ask the user to engage with the remaining visualizations by selecting preferences in each
subsequent section. These preferences inform an overall selection criteria, which is shared across the remaining 
visualizations. So a selection of a particular region, activity, or crowd-preference will affect all remaining
visualizations. The aim of this section is to help the user explore, consider possibilities, and ultimately arrive on 
some decisions for a possible trip to the national parks.

To that end, the final evaluation in step 5 contains a summary of the five parks that most closely match the user's
preferences. This section contains the information needed to begin planning a trip, as retrieved from the National Parks
API. This includes relevant alerts, campground information, possible places of interest, and photos to help make the case.
