const { ipcRenderer } = require("electron");
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let i = 0;

ipcRenderer.send('reply', ['somevar', 'anothervar']);
ipcRenderer.on('sendFromMain', (event, data) => {
        const sendData = document.getElementById(i);
        sendData.innerHTML = "000" + data;
        //   console.log(data);
        i++;
})

function reply_click(clicked_id) {
        // alert(parseInt(clicked_id)+1);
        fs.createReadStream(path.join(__dirname, `/All_csv_files/${parseInt(clicked_id) + 1}.csv`))
                .pipe(csv())
                .on('data', (row) => {
                        console.log(row.timestamp);
                        document.getElementById("col1").innerHTML = new Date(row.timestamp);
                        document.getElementById("col2").innerHTML = parseFloat(row.latitude).toFixed(2);
                        document.getElementById("col3").innerHTML = parseFloat(row.longitude).toFixed(2);
                        var trace1 = {
                                x: [row.latitude],
                                y: [row.longitude],
                                mode: 'line'
                        };

                        var data = [trace1];

                        var layout = {
                                title: 'Plot of Latitude and Longitude',
                                xaxis: {
                                        title: 'Latitude'
                                },
                                yaxis: {
                                        title: 'Longitude'
                                }
                        };

                        Plotly.newPlot('myChart', data, layout);

                })
                .on('end', () => {
                        console.log('CSV file successfully processed');
                });
}


