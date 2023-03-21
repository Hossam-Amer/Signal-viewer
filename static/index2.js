const signal =  {
     warning : document.getElementById('warning'),
     title1 : "",
     chartName: "",
     data : [],
     xAxis : [],
     i : 0,
     color : "#d65151",
     cnt : 0,

     interval:"",
     speed : 100,
     max : -99999999,
     min : 99999999,
     sum : 0,

    counter : document.getElementById('counter'),

    startReadFile: async function startReadFile(elementName) {
        
        signal.data = [];
        signal.xAxis = [];

        signal.cnt = 0;
        signal.i = 0;
        var fr = new FileReader();
        fr.onload = async function () {
            const fullData = fr.result.split('\r\n');

            for (let c = 0; c < fullData.length; c++) {
                const cordinates = fullData[c].split(',');
                
                signal.data.push(cordinates[1]);
                signal.xAxis.push(cordinates[0]);
            }

            await signal.uploadFile();
        }
        fr.readAsText(document.getElementById(elementName).files[0]);
    },


    uploadFile:  async function uploadFile() {
        const inputFile = document.getElementById('file').files[0];
        const warning = document.getElementById('warning');
        if (inputFile) {
            const res = await fetch('/', {
                credentials: "same-origin",
                mode: "same-origin",
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: signal.data })
            }).then(res => res.json())
                .then(dataJson => {
                    signal.data = dataJson;
                    signal.plotSignal();
                });
        }
    },


    getData:  function getData(choose) {
        if (signal.i < signal.data.length) {
            signal.i++;
            counter.innerHTML = signal.i;
            if (signal.data[signal.i] > signal.max) signal.max = signal.data[signal.i];
            if (signal.data[signal.i] < signal.min) signal.min = signal.data[signal.i];
            if (signal.data[signal.i] != null)
                signal.sum += signal.data[signal.i];
            return signal.data[signal.i];
        }
    },



    getXaxis: function getXaxis(choose) {
        if (signal.i < signal.data.length) {
            return signal.xAxis[signal.i];
        }
    },


    changeTitle: function changeTitle(newTitle) {
        signal.title1 = newTitle == null ? "" : newTitle;
    },


    hexToRgb: function hexToRgb() {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(signal.color);
        return `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})`;
    },

    plotSignal:  async function plotSignal() {
        signal.i = 0;


        if (signal.cnt != 0) signal.cnt = 0;


        Plotly.newPlot(signal.chartName, [{
            y: [signal.getData()],
            x: [signal.xAxis[signal.i]],
            type: 'line',
            line: {
                color:signal. hexToRgb(),
                width: 3
            }
        }], {
            autosize: false,
            width: 700,
            height: 500,
            yaxis: {
                fixedrange: true,
            },
            title: { text: signal.title1 },
        });

        signal. play();
    },

    onTimerTik: function onTimerTik() {
        Plotly.extendTraces('chart', { y: [[signal.getData()]], x: [[signal.getXaxis()]] }, [0]);
        signal.cnt++;
        if (signal.cnt > 100) {
            Plotly.relayout('chart', {
                xaxis: {
                    range: [signal.xAxis[signal.cnt - 100], signal.xAxis[signal.cnt]]
                }
            });
        }
        if (signal.cnt > signal.data.length - 1) {
            clearInterval(signal.interval);
        }
    },

    play: function play() {

        if (signal.cnt < signal.data.length - 1) {
            clearInterval(signal.interval);
            signal. interval = setInterval(signal.onTimerTik, signal.speed);
        }
    },
    pause: function pause() {
        clearInterval(signal.interval);
    },
    changeSpeed:  function changeSpeed(numberAdded) {

        if (signal.cnt < signal.data.length) {
            if (numberAdded < 0) {
                if (signal.speed + numberAdded > 0) {
                    signal.speed += numberAdded;
                    signal.pause();
                    signal.interval = setInterval(signal.onTimerTik, signal.speed);
                }
            } else {
                signal.speed += numberAdded;
                signal.pause();
                signal.interval = setInterval(signal.onTimerTik, signal.speed);
            }
        }
    },
    changeColor:  function changeColor() {
        signal.color = document.getElementById('color').value;
        signal.pause();
        signal.plotSignal();
    },
    showStat:  function showStat() {
        const mean = signal.sum / signal.i;
        let variance = 0;
        for (let j = 0; j < signal.i; j++) {
            const num = signal.data[j] - mean;
            const sqrt = num * num;
            variance += sqrt;
        }
        console.log({ min: signal.min, max: signal.max, mean: signal.mean, std: Math.sqrt(variance), duration: signal.i });
    },
}


export default signal