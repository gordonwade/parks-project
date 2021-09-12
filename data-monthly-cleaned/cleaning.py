import pandas as pd


months=['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep']
# months=['may', 'jun', 'jul', 'aug', 'sep']


# unsorted
Parks= ["Acadia NP", "National Park of American Samoa", "Arches NP", "Badlands NP", "Big Bend NP", "Biscayne NP",
"Black Canyon of the Gunnison NP", "Bryce Canyon NP", "Canyonlands NP", "Capitol Reef NP", "Carlsbad Caverns NP",
"Channel Islands NP", "Congaree NP", "Crater Lake NP", "Cuyahoga Valley NP", "Death Valley NP", "Denali NP & PRES",
"Dry Tortugas NP", "Everglades NP", "Gates of the Arctic NP & PRES", "Gateway Arch NP", "Glacier NP",
"Glacier Bay NP & PRES", "Grand Canyon NP", "Grand Teton NP", "Great Basin NP", "Great Sand Dunes NP & PRES",
"Great Smoky Mountains NP", "Guadalupe Mountains NP", "Haleakala NP", "Hawaii Volcanoes NP", "Hot Springs NP",
"Indiana Dunes NP", "Isle Royale NP", "Joshua Tree NP", "Katmai NP & PRES", "Kenai Fjords NP", "Sequoia NP",
"Kobuk Valley NP", "Lake Clark NP & PRES", "Lassen Volcanic NP", "Mammoth Cave NP", "Mesa Verde NP", "Mount Rainier NP",
"North Cascades NP", "Olympic NP", "Petrified Forest NP", "Pinnacles NP", "Redwood NP", "Rocky Mountain NP", "Saguaro NP",
"Shenandoah NP", "Theodore Roosevelt NP", "Virgin Islands NP", "Voyageurs NP", "White Sands NP", "Wind Cave NP",
"Wrangell-St. Elias NP & PRES", "Yellowstone NP", "Yosemite NP", "Zion NP"]


'''
# sorted
Parks= ["Acadia NP", "Arches NP", "Badlands NP", "Big Bend NP", "Biscayne NP", "Black Canyon of the Gunnison NP",
"Bryce Canyon NP", "Canyonlands NP", "Capitol Reef NP", "Carlsbad Caverns NP", "Channel Islands NP", "Congaree NP",
"Crater Lake NP", "Cuyahoga Valley NP", "Death Valley NP", "Denali NP & PRES", "Dry Tortugas NP", "Everglades NP",
"Gates of the Arctic NP & PRES", "Gateway Arch NP", "Glacier NP", "Glacier Bay NP & PRES", "Grand Canyon NP",
"Grand Teton NP", "Great Basin NP", "Great Sand Dunes NP & PRES", "Great Smoky Mountains NP", "Guadalupe Mountains NP",
"Haleakala NP", "Hawaii Volcanoes NP", "Hot Springs NP", "Indiana Dunes NP", "Isle Royale NP", "Joshua Tree NP",
"Katmai NP & PRES", "Kenai Fjords NP", "Kobuk Valley NP", "Lake Clark NP & PRES", "Lassen Volcanic NP", "Mammoth Cave NP",
"Mesa Verde NP", "Mount Rainier NP", "National Park of American Samoa", "North Cascades NP", "Olympic NP",
"Petrified Forest NP", "Pinnacles NP", "Redwood NP", "Rocky Mountain NP", "Saguaro NP", "Sequoia NP",
"Shenandoah NP", "Theodore Roosevelt NP", "Virgin Islands NP", "Voyageurs NP", "White Sands NP", "Wind Cave NP",
"Wrangell-St. Elias NP & PRES", "Yellowstone NP", "Yosemite NP", "Zion NP"]
'''

def write_csv():
    for m in months:

        print(m)
        df= pd.read_excel(m+'.xlsx')

        '''
        df.loc[11:388]

        Unnamed: 1         Park
        Unnamed: 6     SEP 2019
        Unnamed: 7     SEP 2020
        Unnamed: 10        DIFF
        Unnamed: 11    YTD 2019
        Unnamed: 13    YTD 2020
        Unnamed: 15        DIFF
        '''

        dfnew=pd.DataFrame(columns=['Park',f'{m} 2019', f'{m} 2020', f'{m} DIFF', 'YTD 2019', 'YTD 2020', 'YTD DIFF'])

        # extract valid rows
        for i in range(11,389):

            # jan.xlsx has less rows
            if m=='jan' and i==379:
                break
            dfnew.loc[i-11]= df.loc[i].filter(items=['Unnamed: 1', 'Unnamed: 6', 'Unnamed: 7', 'Unnamed: 10', 'Unnamed: 11', 'Unnamed: 13', 'Unnamed: 15']).values

        # filter national parks
        dfnew= dfnew[dfnew['Park'].isin(Parks)]

        dfnew.to_csv(m+'.csv', index=False)

        print(dfnew.shape)


import json
def write_json():

    # read csv data
    data_csv= {}
    for m in months:
        data_csv[m]= pd.read_csv(m+'.csv')

    # read json data
    with open('../presentation/data/cleaned_data.json', 'rb') as f:
        data_json = json.load(f)

    json_parks = [obj['park'] for obj in data_json]

    # insert monthly statistics in csv
    for p in Parks:
        # print(p)

        # find the index of p in json_parks
        for i,jp in enumerate(json_parks):
            if jp==p:
                ind=i
                break

        # initialize the 'monthly visit' dict
        data_json[ind]['monthly visit']={}

        # delete old keys
        del data_json[ind]["previous_month"]
        del data_json[ind]["current_month"]
        del data_json[ind]["month_diff"]
        del data_json[ind]["previous_ytd"]
        del data_json[ind]["current_ytd"]
        del data_json[ind]["ytd_diff"]

        for m in months:
            # print(m)

            # data_csv is searched to obtain index of p and so immune to the order in data_csv
            val= data_csv[m][data_csv[m]['Park']==p]

            # months jan, feb, mar, apr has <61 parks, so val can be empty for some parks
            if not val.empty:
                del val['Park']

                data_json[ind]['monthly visit'][m]= val.to_dict('records')[0]
            else:
                print(m)
                print(p)

    # write out combined json
    with open('cleaned_data_monthly.json', 'w') as f:
        json.dump(data_json, f)

if __name__=='__main__':
    write_json()
