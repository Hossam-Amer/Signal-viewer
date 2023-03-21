from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route('/',methods = ['GET'])
def main_route():
    return render_template('index.html')

@app.route('/',methods = ['POST'])
def get_data():
    data=request.get_json()["data"]
    dataarr=[]
    for i in data:
        try :
            dataarr.append(float (i))
        except:
            pass
    return dataarr
    # data = request.get_json()['data']
    # dataNumber = [ float(x) for x in data ]
    # return dataNumber

if __name__ == '__main__':
    app.run(debug=True, port=3300)