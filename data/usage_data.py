import random
import names
import json
import uuid

avg_energy_usages = [175,100,150,250]
avg_water_usages = [140,100,170,220,200]



def month_year_iter(start_month, start_year, end_month, end_year):
    ym_start = 12*start_year + start_month - 1
    ym_end = 12*end_year + end_month - 1
    for ym in range(ym_start, ym_end):
        y, m = divmod(ym, 12)
        yield y, m+1


def simulate_usage(avg_usage,days):
    values = []
    daily_avg = avg_usage/30

    for i in range(days):
        values.append(round(daily_avg*random.uniform(0.75,1.5),2))
    return values


def simulate_hourly_usage(avg_usage,days):
    values = []
    daily_avg = avg_usage/30.0
    hourly_avg =daily_avg/24.0

    for i in range(days):
        hourly = []
        for j in range(24):
            hour ={}
            hour['hour'] = j+1
            hour['usage'] = round(hourly_avg*random.uniform(0.3,1.9),2)
            hourly.append(hour)
        day = {}
        day_sum =0.0
        for item in hourly:
            day_sum += float(item['usage'])
        day['usage'] = day_sum
        day['hourly_values'] = hourly
        values.append(day)
    return values

def get_sum(month):
    total = 0.0
    for day in month:
        total += day['usage']
    return total


def calculate_coins(pledged, actual):
    return 42


def days_in_month(month, year):
    from calendar import monthrange
    return monthrange(year, month)[1]


def create_month(month, year, avg_usage):
    month_detail = {}
    month_detail['month'] = month
    month_detail['year'] =  year
    #month_detail['daily_values'] = simulate_usage(avg_usage,days_in_month(month,year))
    month_detail['daily_values'] = simulate_hourly_usage(avg_usage,days_in_month(month,year))
    #month_detail['usage'] =  round(sum(month_detail['daily_values']),2)
    month_detail['usage'] =  round(get_sum(month_detail['daily_values']),2)
    month_detail['pledged'] = round(get_sum(month_detail['daily_values']) *  random.uniform(0.8,1.3), 2)
    month_detail['earned_coins'] = calculate_coins(month_detail['pledged'], month_detail['usage'])
    return month_detail

def getrandomstate():
    states = ['Uttar Pradesh','Maharashtra','Bihar','West Bengal','Madhya Pradesh','Tamil Nadu','Rajasthan','Karnataka','Gujarat','Andhra Pradesh','Odisha','Telangana','Kerala','Jharkhand','Assam','Punjab','Chhattisgarh','Haryana','Jammu and Kashmir','Uttarakhand','Himachal Pradesh','Tripura','Meghalaya','Manipur','Nagaland','Goa','Arunachal Pradesh','Mizoram','Sikkim','Delhi','Puducherry','Chandigarh','Andaman and Nicobar Islands','Dadra and Nagar Haveli','Daman and Diu','Lakshadweep']
    return random.choice(states)


def get_transactions():
    transactions={}
    transactions['water'] = []
    transactions['fuel'] = []

    energy_months=[]
    water_months=[]
    for item in (month_year_iter(01,2015,03,2016)):
        energy_months.append(create_month(item[1],item[0],random.choice(avg_energy_usages)))
        water_months.append(create_month(item[1],item[0],random.choice(avg_water_usages)))
    transactions['energy'] = energy_months
    transactions['water'] = water_months
    return transactions




def create_user_details():
    user = {}
    user['id'] = str(uuid.uuid4())
    user['name'] = names.getIndianName()
    user['state'] = getrandomstate()
    user['country'] = "India"
    user['transactions'] = get_transactions()
    return user


if __name__ == '__main__':
    users=[]
    for i in range(10):
        users.append(create_user_details())
    with open('data.json','w') as f:
        json.dump(users, f,sort_keys=True,indent=4, separators=(',', ': '))
