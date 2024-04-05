let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData  // uma vez que realizarmos o fetch nos json, armazenaremos aqui o conteúdo necessário
let educationData   // uma vez que realizarmos o fetch nos json, armazenaremos aqui o conteúdo necessário

let canvas = d3.select('#canvas')  // selecionando o svg de nosso html para facilitar a manipulação através da variável
let tooltip = d3.select('#tooltip')

let drawMap = () => { // onde estaremos realmente desenhando o mapa através do data

    canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (countyDataItem) => {
            let id = countyDataItem['id']
            let county = educationData.find((item) => {
                return item['fips'] === id

            })
            let percentage = county['bachelorsOrHigher']
            if (percentage <= 15) {
                return 'tomato'
            } else if (percentage <= 30) {
                return 'orange'
            } else if (percentage <= 45) {
                return 'lightgreen'
            } else {
                return 'limegreen'
            }
        })
        .attr('data-fips', (countyDataItem) => {
            return countyDataItem['id']
        })
        .attr('data-education', (countyDataItem) => {
            let id = countyDataItem['id']
            let county = educationData.find((item) => {
                return item['fips'] === id
            })
            let percentage = county['bachelorsOrHigher']
            return percentage
        })

        .on('mouseover', (e, countyDataItem) => {
            tooltip.transition()
                .style('visibility', 'visible')

            let id = countyDataItem['id']
            let county = educationData.find((item) => {
                return item['fips'] === id
            })

            tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
                    county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

                tooltip.attr('data-education', county['bachelorsOrHigher'] )
            })
            .on('mouseout', (countyDataItem) => {
                tooltip.transition()
                    .style('visibility', 'hidden')
            })
}

d3.json(countyURL).then(
    (data, error) => {
        if (error) {
            console.log(log)
        } else {
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                })
        }
    }
)