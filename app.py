import os
from flask import Flask, jsonify,request
from sklearn import metrics
from werkzeug.utils import secure_filename
from flask_cors import CORS
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose
from pmdarima import auto_arima
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_squared_error
from statsmodels.tools.eval_measures import rmse
import matplotlib
matplotlib.use('Agg')
from flask_pymongo import pymongo

mongodb_url="mongodb_url"
mongoDB=pymongo.MongoClient(mongodb_url)
db=mongoDB['sales_forecasting_app']
login=db.login

# print("db connected successfully!")




app = Flask(__name__)
CORS(app)




	
@app.route('/upload', methods = ['GET','POST'])
def upload_file():
#    print(request.files.get('file'))
   if request.method == 'POST':
        file = request.files['file']
        periodicity=request.form['period']
        duration=request.form['duration']

         # print(request.form('period'))
         # print(request.form('duration'))

        period=0
        if(periodicity=='year'):
             period=12
        elif(periodicity=='month'):
             period=1
        elif(periodicity=='week'):
             period=0.25
        else:
             period=0.0329

        Gadget = pd.read_csv(file,index_col ='Month',parse_dates = True)
  

        # Gadget.head()
        # Gadget.tail()
  

        result = seasonal_decompose(Gadget['Laptop_sales'], model ='multiplicative')
  
 
        # result.plot()

  

        combinations = auto_arima(Gadget['Laptop_sales'], start_p = 1, start_q = 1,max_p = 3, max_q = 3, m = 12,start_P = 0, seasonal = True,d = None, D = 1, trace = True,error_action ='ignore',suppress_warnings = True,stepwise = True)           
  

        # combinations.summary()
        
        train = Gadget.iloc[:len(Gadget)-12]
        test = Gadget.iloc[len(Gadget)-12:] 

        # Best model from the auto_arima() is SARIMAX(0, 1, 1)x(2, 1, 1, 12) GOT IT FROM THE "combinations.summary()"
  


  
        model = SARIMAX(train['Laptop_sales'], 
                order = (0, 1, 1), 
                seasonal_order =(2, 1, 1, 12))
  
        result = model.fit()
        result.summary()
        start = len(train)
        end = len(train) + len(test) - 1
  

        predictions = result.predict(start, end,
                             typ = 'levels').rename("Predictions")
  

        predictions.plot(legend = True)
        test['Laptop_sales'].plot(figsize = (12, 8),legend = True)
        prediction_vs_actual = "D:/benq/KAAR TECH/sales-forecasting/Sales-forecasting-app/src/assets/Predictions/prediction_vs_actual.png"
        if os.path.isfile(prediction_vs_actual):
             os.remove(prediction_vs_actual)
             print("first")
        plt.savefig(prediction_vs_actual)
        plt.clf()
        plt.cla()
        plt.close()
        

        #Calculation of the error metrics
        
        rmse1=rmse(test["Laptop_sales"], predictions)
        mse=mean_squared_error(test["Laptop_sales"], predictions)
        mae=metrics.mean_absolute_error(test["Laptop_sales"], predictions)
        mape=metrics.mean_absolute_percentage_error( test["Laptop_sales"], predictions)
        mape=round(mape*100, 2)
        
        model=SARIMAX(Gadget['Laptop_sales'], 
                        order = (0, 1, 1), 
                        seasonal_order =(2, 1, 1, 12))
        result = model.fit()
  

        forecast = result.predict(start = len(Gadget)-1,end = (len(Gadget)-1)  + int(period*int(duration)),typ = 'levels').rename('Forecast')
       
  

        visualization = Gadget
        if(periodicity == 'month'):
             visualization=Gadget.iloc[len(Gadget)-60:]
        elif(periodicity == 'week'):
             visualization=Gadget.iloc[len(Gadget)-36:]
        elif(periodicity == 'day'):
             visualization=Gadget.iloc[len(Gadget)-12:]
             
        visualization['Laptop_sales'].plot(figsize = (12, 6), legend = True)
        forecast.plot(legend = True) 
        plt.xlabel("years")

        if(periodicity == 'day'):
              plt.xlabel("months")
        
        forecast.to_csv('D:/benq/KAAR TECH/sales-forecasting/Sales-forecasting-app/src/assets/file/forecast.csv',index_label='Date')
        forecast_graph = "D:/benq/KAAR TECH/sales-forecasting/Sales-forecasting-app/src/assets/Predictions/forecast.png"
        if os.path.isfile(forecast_graph):
             os.remove(forecast_graph)
             
        plt.savefig(forecast_graph)
        plt.clf()
        plt.cla()
        plt.close()

        metrics_result={"mape":mape,"mae":mae,"rmse":rmse1,"mse":mse,"duration":duration,"period":periodicity}

        # print(mape)
        # print(mae)
        # print(rmse1)
        # print(mse)
        
        
        return jsonify(metrics_result)
       
       

@app.route('/login',methods=['POST'])
def valid_login():
        if request.method == 'POST':
             
            email = request.form['email']
            password =request.form['password']

            for users in login.find():
                 if(users['username'] == email and users['password']== password):
                      return jsonify("valid login")
                 elif(users['username'] == email and users['password']!= password):
                      return jsonify("Password is incorrect")
            return jsonify("Sorry, user with this email id does not exist")



if __name__ == '__main__':
   app.run(debug = True)
