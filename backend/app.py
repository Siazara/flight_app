from flask import Flask, render_template, request
from flask_cors import CORS
import pandas as pd
import json

app = Flask(__name__)
CORS(app)
df = pd.read_csv('./flask_df.csv')

cities = {0: 'Tehran',
1:"Mashhad",
2:"Shiraz",
3:"Ahwaz",
4:"Isfahan",
5:"Tabriz",
6:'Kish',
7:'Kerman'}

# dates = {0: "2022-01-24",
#         1: "2022-01-25",
#         2: "2022-01-26",
#         3: "2022-01-27",
#         4: "2022-01-28",
#         5: "2022-01-29"}

# @app.route("/")
# def home():
#     return render_template('index.html')
@app.route("/delay", methods=['GET','POST'])
def predict():
    if request.method == 'POST':
        #access the data from form
        user_inputs = request.get_json()
        print(user_inputs)
        origin = user_inputs["origin"]
        destination = user_inputs["destination"]
        departure = user_inputs["departure"]
        output = df.loc[(df['airport'] == origin) & \
            (df['destination'] == destination) & (df['scheduled_date'].astype('str') == departure)]
        flights = []
        for i, row in output.iterrows():
            if row["('delay', 'median')"] < 30:
                flights.append(f"flight number {row['flight_num']}, airline {row['airline']}\
                , at {row['scheduled_time']}, often has +15 mintues delay")
            elif row["('delay', 'median')"] >= 30:
                flights.append(f"flight number {row['flight_num']}, airline {row['airline']}\
                    , at {row['scheduled_time']}, often has +30 mintues delay")
            else:
                flights.append(f"flight number {row['flight_num']}, airline {row['airline']}\
                    , at {row['scheduled_time']}")

        # return render_template("index.html", names=flights)
        # cities['method'] = 'POST'
        return json.dumps(flights)
    elif request.method == 'GET':
        cities[-1] = 'GET'
        return json.dumps(cities)

if __name__ == "__main__":
    app.run(debug=True)