const warning = document.getElementById('warning');
var title1 = "Signal 1";
var data = [];
var xAxis = [];
var i = 0;
var color = "#d65151";
var cnt = 0;
let interval;
let speed = 100;
let max = -99999999;
let min = 99999999;
let sum = 0;
let link = false;
let xFirst = 0;
let xLast = 0;
let isPause = false;


var title2 = "signal 2";
var data2 = [];
var xAxis2 = [];
var i2 = 0;
var color2 = "#d65151";
var cnt2 = 0;
let interval2;
let speed2 = 100;
let max2 = -99999999;
let min2 = 99999999;
let sum2 = 0;


async function startReadFile() {
    data = [];
    xAxis = [];
    cnt = 0;
    i = 0;
    var fr = new FileReader();
    fr.onload = async function () {
        const fullData = fr.result.split('\r\n');
        for (let c = 0; c < fullData.length; c++) {
            const cordinates = fullData[c].split(',');
            data.push(cordinates[1]);
            xAxis.push(cordinates[0]);
        }
        await uploadFile(data, 1);
    }
    fr.readAsText(document.getElementById('file').files[0]);
}

async function startReadFile2() {
    data2 = [];
    xAxis2 = [];
    cnt2 = 0;
    i2 = 0;
    var fr = new FileReader();
    fr.onload = async function () {
        const fullData = fr.result.split('\r\n');
        for (let c = 0; c < fullData.length; c++) {
            const cordinates = fullData[c].split(',');
            data2.push(cordinates[1]);
            xAxis2.push(cordinates[0]);
        }
        await uploadFile(data2, 2);
    }
    fr.readAsText(document.getElementById('file2').files[0]);
}

async function uploadFile(fileUploaded, viewerNumber) {
    const res = await fetch('/', {
        credentials: "same-origin",
        mode: "same-origin",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: fileUploaded })
    }).then(res => res.json())
        .then(dataJson => {
            fileUploaded = dataJson;
            plotSignal(viewerNumber);
        });
}

function getData(viewerNumber) {
    if (viewerNumber == 1) {
        if (i < data.length) {
            i++;
            if (data[i] > max) max = Number(data[i]);
            if (data[i] < min) min = Number(data[i]);
            if (data[i] != null) sum += Number(data[i]);

            return data[i];
        }
    } else {
        if (i2 < data2.length) {
            i2++;
            if (data2[i2] > max2) max2 = Number(data2[i2]);
            if (data2[i2] < min2) min2 = Number(data2[i2]);
            if (data2[i2] != null)
                sum2 += Number(data2[i2]);
            return data2[i2];
        }
    }
}

function getXaxis(viewerNumber) {
    if (viewerNumber == 1) {
        if (i < data.length) {
            return xAxis[i];
        }
    }
    else {
        if (i2 < data2.length) {
            return xAxis2[i2];
        }
    }
}

function changeTitle(id) {
    const tmpTitle = document.getElementById(id).value;
    if (id == "title") {
        title1 = tmpTitle == null ? "" : tmpTitle;
        
        const layout = {
            autosize: false,
            width: 1000,
            height: 500,
            yaxis: {
                fixedrange: true,
            },
            title: { text: title1 },
            showlegend: true,
        };

        Plotly.update('chart', [], layout);
        //plotSignal(1)
    } else {

        title2 = tmpTitle == null ? "" : tmpTitle;
        const layout = {
            autosize: false,
            width: 1000,
            height: 500,
            yaxis: {
                fixedrange: true,
            },
            title: { text: title2 },
            showlegend: true,
        };

        Plotly.update('chart2', [], layout);
        //plotSignal(2)
    }
}



function hexToRgb() {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})`;
}

async function plotSignal(viewerNumber) {
    if (viewerNumber == 1) {
        i = 0;
        if (cnt != 0) cnt = 0;
    } else {
        i2 = 0;
        if (cnt2 != 0) cnt2 = 0;
    }

    const layout = {
        autosize: false,
        width: 1000,
        height: 500,
        yaxis: {
            fixedrange: true,
        },
        title: { text: title1 },
        showlegend: true,
    };

    const layout2 = {
        autosize: false,
        width: 1000,
        height: 500,
        yaxis: {
            fixedrange: true,
        },
        title: { text: title2 },
        showlegend: true,
    };
    let trace;
    const line = {
        color: hexToRgb(),
        width: 3
    };
    if (viewerNumber == 1) {
        trace = {
            y: [getData(viewerNumber)],
            x: [xAxis[i]],
            type: 'line',
            line,
        };
        Plotly.newPlot('chart', [trace], layout);

        var myDiv = document.getElementById("chart");



        myDiv.on('plotly_relayout', function (eventdata) {
            xFirst = eventdata['xaxis.range[0]'];
            xLast = eventdata['xaxis.range[1]'];
            let change = false;
            if (xFirst < 0) {
                xFirst = 0;
                change = true;
            }
            if (xLast > xAxis[cnt - 1]) {
                xLast = xAxis[cnt - 1];
                change = true;
            }

            if (change) {
                Plotly.relayout('chart', {
                    xaxis: {
                        range: [xFirst, xLast]
                    }
                });
            }

            if (link) {
                Plotly.relayout('chart2', {
                    xaxis: {
                        range: [xFirst, xLast]
                    }
                });
            }

        });

    }
    if (viewerNumber == 2 || link) {
        trace = {
            y: [getData(viewerNumber)],
            x: [xAxis2[i2]],
            type: 'line',
            line,
        };
        Plotly.newPlot('chart2', [trace], layout2);
        var myDiv2 = document.getElementById("chart2");

        myDiv2.on('plotly_relayout',
           function  (eventdata) {
                if (eventdata['xaxis.range[0]'] < 0) {
                    Plotly.relayout('chart2', {
                        xaxis: {
                            range: [0, xAxis2[cnt2]]
                        }
                    });
                } else if (eventdata['xaxis.range[1]'] > xAxis2[xAxis2.length - 1]) {
                    Plotly.relayout('chart2', {
                        xaxis: {
                            range: [0, xAxis2[xAxis2.length - 1]]
                        }
                    });
                }
            });
    }
}


function zoomIn() {
    xFirst = Math.round(20 * cnt / 100);
    xLast = Math.max(cnt - xFirst, 0);



    var update = {
        xaxis: {
            range: [xAxis[xFirst], xAxis[xLast]]
        }
    };
    Plotly.update(document.getElementById('chart'), { x: [xAxis.slice(xFirst, xLast)] }, update);
}

function zoomOut() {

}
function onTimerTik(viewerNumber) {
    if (isPause) {
        return;
    }

    if (viewerNumber == 1) {
        Plotly.extendTraces('chart', { y: [[getData(viewerNumber)]], x: [[getXaxis(viewerNumber)]] }, [0]);
        cnt++;
        if (cnt > 100) {
            Plotly.relayout('chart', {
                xaxis: {
                    range: [xAxis[cnt - 100], xAxis[cnt]]
                }
            });
        }
        if (cnt > data.length - 1) {
            clearInterval(interval);
        }
    } else {
        Plotly.extendTraces('chart2', { y: [[getData(viewerNumber)]], x: [[getXaxis(1)]] }, [0]);
        cnt2++;
        if (cnt2 > 100) {
            Plotly.relayout('chart2', {
                xaxis: {
                    range: [xAxis2[cnt2 - 100], xAxis2[cnt2]]
                },
            });
        }
        if (cnt2 > data2.length - 1) {
            clearInterval(interval2);
        }
    }

}

function play(viewerNumber) {
    if (viewerNumber == 1) {
        if (cnt < data.length - 1) {
            clearInterval(interval);
            interval = setInterval(() => onTimerTik(viewerNumber), speed);
        }
    }
    if (viewerNumber == 2 || link == true) {
        if (cnt2 < data2.length - 1) {
            clearInterval(interval2);
            interval2 = setInterval(() => onTimerTik(2), speed2);
        }
    }
}


function pause(viewerNumber) {
    if (viewerNumber == 1) clearInterval(interval);
    if (viewerNumber == 2 || link) clearInterval(interval2);
}

function changeSpeed(numberAdded, chartid) {
    if (chartid == 1) {
        if (cnt < data.length) {
            if (numberAdded < 0) {
                if (speed + numberAdded > 0) {
                    speed += numberAdded;
                    pause(chartid);
                    // interval = setInterval(onTimerTik, speed);
                    play(1)
                }
            } else {
                speed += numberAdded;
                pause(chartid);
                // interval = setInterval(onTimerTik, speed);
                play(1)
            }
        }
    }
    if (chartid == 2 || link) {
        if (cnt2 < data2.length) {
            if (numberAdded < 0) {
                if (speed2 + numberAdded > 0) {
                    speed2 += numberAdded;
                    pause(2);
                    // interval2 = setInterval(onTimerTik, speed2);
                    play(2)
                }
            } else {
                speed2 += numberAdded;
                pause(2);
                // interval2 = setInterval(onTimerTik, speed2);
                play(2)
            }
        }
    }
}

function changeColor(viewerNumber) {
    color = document.getElementById(`color${viewerNumber == 1 ? "" : 2}`).value;
        pause(viewerNumber);
    plotSignal(viewerNumber);
}
/*
//Link function
        const link = document.getElementById('link');
        var linked = false;

        link.addEventListener('change', (event) => {
            if(event.currentTarget.checked){
                linked = true;
                playAnim = true;
                i = 0;
                trace1.x =[];
                trace1.y =[];
               
                speedSlider.value = speedSlider.defaultValue; //returns to its deafult value
                cinespeed = speedSlider2.defaultValue;

                Plotly.redraw(plotDiv);
                playBtn.click(); // restart the animation

                
                playAnim2 = true;
                j = 0;
                trace2.x =[];
                trace2.y =[];
         
                speedSlider2.value = speedSlider2.defaultValue; //returns to its deafult value
                cinespeed2 = cinespeed

                Plotly.redraw(plotDiv2);
                playBtn2.click(); // restart the animation

                

        //define a flag to avoid infinite loop
        let isRelayouting = false;

                
                
        // Link plot1 to plot2
        plotDiv.on('plotly_relayout', function(eventData) {
            if (linked && !isRelayouting) {
                isRelayouting = true;
                Plotly.relayout(plotDiv2, eventData)
                .then(() => {
                    isRelayouting = false;
                });
            }
        });

        // Link plot2 to plot1
        plotDiv2.on('plotly_relayout', function(eventData) {
            if (linked && !isRelayouting) {
                isRelayouting = true;
                Plotly.relayout(plotDiv, eventData)
                .then(() => {
                    isRelayouting = false;
                });
            }
        });       
            }
            else
            {
                linked = false;
            }
        });
// function showStat() {
//     const mean = sum / i;
//     let variance = 0;
//     for (let j = 0; j < i; j++) {
//         const num = data[j] - mean;
//         const sqrt = num * num;
//         variance += sqrt;
//     }
//     console.log(sum)
//     console.log({ min, max, mean, std: Math.sqrt(variance), duration: xAxis[i] });
// }

        */

async function showStat() {

    const mean = sum / i;
    let variance = 0;
    for (let j = 0; j < i; j++) {
        const num = data[j] - mean;
        const sqrt = num * num;
        variance += sqrt;
    }
    std = Math.sqrt(variance)
    duration = i


    const mean2 = sum2 / i2;
    let variance2 = 0;
    for (let j = 0; j < i2; j++) {
        const num2 = data2[j] - mean2;
        const sqrt2 = num2 * num2;
        variance2 += sqrt2;
    }
    std2 = Math.sqrt(variance2)
    duration2 = i2

    var doc = new jsPDF();
    var image = new Image();
    var image2 = new Image();

    var index = 0;
    var result = []
    if (max != -99999999) {
        const dataURL1 = await Plotly.toImage('chart', { format: 'png', width: 800, height: 600 });
        image.src = dataURL1;
        doc.addImage(image, 10, 50, 100, 100);
        result[index] =
        {
            Signal: title1,
            Min: min,
            Max: max,
            Mean: mean,
            Std: std,
            Duration: xAxis[duration]
        }
        index++;
    }

    if (max2 != -99999999) {
        const dataURL2 = await Plotly.toImage('chart2', { format: 'png', width: 800, height: 600 });
        image2.src = dataURL2;
        doc.addImage(image2, 120, 50, 100, 100);
        result[index] =
        {
            Signal: title2,
            Min: min2,
            Max: max2,
            Mean: mean2,
            Std: std2,
            Duration: xAxis2[duration2]
        }
    }






    let info = []
    result.forEach((element, index, array) => {
        info.push([element.Signal, element.Min, element.Max, element.Mean, element.Std, element.Duration])
    })
    doc.autoTable({
        head: [["Signal ", "min", "max", " mean", "standard deviation", "Duration"]],
        body: info,
    });
    doc.save("table.pdf");
}






document.getElementById('play').addEventListener('click', () => {
    isPause = false
    play(1);
});
document.getElementById('pause').addEventListener('click', () => isPause = true);
document.getElementById('changeTitle').addEventListener('click', () => { changeTitle('title') });

document.getElementById('stat').addEventListener('click', showStat);
document.getElementById('chkbox').addEventListener('change', function () {
    link = !link;
});



document.getElementById('color').addEventListener('change', () => changeColor(1));
document.getElementById('file').addEventListener('change', () => startReadFile());
document.getElementById('speedup').addEventListener('click', () => { changeSpeed(10, 1); });
document.getElementById('speeddown').addEventListener('click', () => { changeSpeed(-10, 1); });





document.getElementById('play2').addEventListener('click', function () { if (!link) play(2) });
document.getElementById('pause2').addEventListener('click', function () { if (!link) pause(2) });
document.getElementById('changeTitle2').addEventListener('click', () => { changeTitle('title2') });
document.getElementById('statistics2').addEventListener('click', showStat);
document.getElementById('color2').addEventListener('change', () => changeColor(2));
document.getElementById('file2').addEventListener('change', () => startReadFile2());
document.getElementById('speedup2').addEventListener('click', function () { if (!link) changeSpeed(10, 2); });
document.getElementById('speeddown2').addEventListener('click', function () { if (!link) changeSpeed(-10, 2); });