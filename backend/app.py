from flask import Flask, redirect, url_for, render_template, request, session
from flask_cors import CORS
import jdatetime
import requests
import pandas as pd
import numpy as np
import json
from operator import itemgetter
from datetime import datetime
import psycopg2
import pickle
import re

with open('/home/arman.nasirkhani/5254/airline_names.pkl', 'rb') as f:
    airline_names = pickle.load(f)

with open('/home/arman.nasirkhani/5254/ICAO_codes.pkl', 'rb') as f:
    ICAO_codes = pickle.load(f)

conn = psycopg2.connect(database='airline_stats', user='postgres', password="12345", host='127.0.0.1', port='5432')

f = open('airport_codes.json')
airport_codes = json.load(f)
f.close()

def delay_historical_stats(data):

    logoname = airline_names[data["airline"].replace(" ", "").encode("UTF-8")]
    origin_ICAO = ICAO_codes[data["origin"].replace("\d|[a-zA-Z]|:| |\u200c|[$]", "").encode("UTF-8")]
    destination_ICAO = ICAO_codes[data["destination"].replace("\d|[a-zA-Z]|:| |\u200c|[$]", "").encode("UTF-8")]
    departure_scheduled_h = datetime.fromisoformat(data["departure_time"]).time().hour
    flight_number = re.search("(\d+)", data["flight_number"])[0]

    cur = conn.cursor()
    cur.execute(f"SELECT ontime, delayed FROM AIRLINE_DELAYS WHERE unq_flt = '{logoname}-{departure_scheduled_h}-{origin_ICAO}-{destination_ICAO}-{flight_number}';")
    delay = cur.fetchone()
    data['ontime_or_delayed'] = 0
    if delay != None:
        if sum(delay) == 1:
            data['ontime_or_delayed'] = 1 if delay[0] else -1

    return data

def price_historical_stats(data):

    origin_ICAO = ICAO_codes[data[-1]["origin"].replace("\d|[a-zA-Z]|:| |\u200c|[$]", "").encode("UTF-8")]
    destination_ICAO = ICAO_codes[data[-1]["destination"].replace("\d|[a-zA-Z]|:| |\u200c|[$]", "").encode("UTF-8")]

    cur = conn.cursor()
    cur.execute(f"SELECT min, q1, q3, max FROM AIRLINE_PRICES WHERE org = '{origin_ICAO}' AND dest = '{destination_ICAO}';")
    price = cur.fetchone()

    if price != None:
        price = list(map(int, price))
        data.append(dict(zip(['min', 'q1', 'q3', 'max'], price)))

    return data

def datetime_converter(date):
    month2num = {
        'Jan':'01',
        'Feb':'02',
        'Mar':'03',
        'Apr':'04',
        'May':'05',
        'Jun':'06',
        'Jul':'07',
        'Aug':'08',
        'Sep':'09',
        'Oct':'10',
        'Nov':'11',
        'Dec':'12'
    }
    date = str(date)
    date = date.split()
    result = '/'.join([date[3], month2num[date[1]], date[2]])
    return result

def get_flight_data(origin: str, destination: str, departure_date:str) -> str:
    """
        Gets flight data of a specific route at a specific date.

        Args:
            origin: origin of flight.
            destination: destination of flight.
            departure_date: date of departure.

        Returns:
            flight_date: flight data aquired from web.
        """
    payload = {"AdultCount":1,"ChildCount":0,"InfantCount":0,"CabinClass":"All","Routes":[{"OriginCode":origin,"DestinationCode":destination,"DepartureDate":departure_date}]}
    headers = {
        'authority': 'flight.atighgasht.com',
        'origin': 'https://mrbilit.com',
        'referer': 'https://mrbilit.com/',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJidXMiOiI0ZiIsInRybiI6IjE3Iiwic3JjIjoiMiJ9.vvpr9fgASvk7B7I4KQKCz-SaCmoErab_p3csIvULG1w'
    }
    r = requests.post('https://flight.atighgasht.com/api/Flights', json=payload, headers=headers)
    data = []
    flights = r.json()['Flights']
    for flight in flights:
        row = {}
        try:
            row['price'] = flight['Prices'][0]['PassengerFares'][0]['TotalFare']
            num = flight['Segments'][0]['Legs'][0]['FlightNumber']
            code = flight['Segments'][0]['Legs'][0]['Airline']['IataCode']
            row['flight_number'] = f'{code}{num}'
            row['origin'] = flight['Segments'][0]['Legs'][0]['Origin']
            row['destination'] = flight['Segments'][0]['Legs'][0]['Destination']
            row['airline'] = flight['Segments'][0]['Legs'][0]['Airline']['PersianTitle']
            row['departure_time'] = flight['Segments'][0]['Legs'][0]['DepartureTime']
            row['arrival_time'] = flight['Segments'][0]['Legs'][0]['ArrivalTime']
            row = delay_historical_stats(row)
            data.append(row)
        except:
            pass

    data = price_historical_stats(data)
    return json.dumps(data)

app = Flask(__name__, static_url_path='/static')
cors = CORS(app)

app.secret_key = 'C4TB0Y'


@app.route("/get_data/", methods=["POST", "GET"])
def get_data():
    city_dict = {'تهران':'THR', 'مشهد':'MHD', 'اصفهان':'IFN', 'تبریز':'TBZ', 'اهواز':'AWZ', 'شیراز':'SYZ', 'کیش':'KIH'}
    origin = airport_codes[request.args.get('origin', type=str)]
    print(origin)
    destination = airport_codes[request.args.get('destination', type=str)]
    print(destination)
    departure = (datetime_converter(request.args.get('departure', type=str)))
    print(departure)
    if departure != None:
        origin = origin
        print(origin)
        destination = destination
        print(destination)
        data = get_flight_data(origin, destination, departure)

    print(data)
    return data
