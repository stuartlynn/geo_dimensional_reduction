from flask import Flask, jsonify,request, make_response
import requests
from sklearn.manifold import  MDS
from sklearn.decomposition import PCA
from urllib.parse import urlencode
from shutil import rmtree
import pandas as pd
from io import StringIO
from tempfile import mkdtemp
import subprocess
import sys
from io import StringIO
import numpy as np
import cartoframes as cf
from flask_cors import CORS
from MulticoreTSNE import MulticoreTSNE as TSNE

app = Flask(__name__)
CORS(app)

def console_print(message):
    print(message, file=sys.stderr)


def calcPCA(data):
    pca = PCA(n_components=2)
    normed_data = normalizeData(data)
    result = pca.fit_transform(normed_data)
    return data.assign(x=result[:,0], y= result[:,1])


def calcTSNEMulti(data,iterations,perplexity,learning_rate):
    tsne = TSNE(n_jobs=4,
                perplexity=perplexity,
                n_iter=iterations,
                learning_rate= learning_rate)

    normed_data = normalizeData(data)
    Y = tsne.fit_transform(normed_data)
    return data.assign(x= Y[:,0], y = Y[:,1])


def calcMDS(data):
    console_print("#### starting to run MDS #####")
    results = MDS().fit_transform(data)
    console_print("#### done MDS #####")
    return data.assign(x=results[:,0], y= results[:,1])


def normalizeData(data):
    return  (data - data.min())/(data.max()-data.min())

def getCartoContext(username,apikey):
    creds  = cf.Credentials(username=username,key=apikey)
    cc = cf.CartoContext(creds=creds)
    return cc

def getCartoData(cc,query):
    columns = cc.query( "select * from ({}) a  limit  1".format(query)).drop([
        'the_geom'
        ],
        axis=1
    ).columns
    console_print(columns)
    data = cc.query("select {}, cartodb_id as orig_id from ({}) a ".format( ','.join(list(columns)),query ))
    return data.fillna(0)

@app.route('/')
def home():
    return 'working'

@app.route('/PCA')
def runPCA():
    user = request.args.get('user')
    query = request.args.get('query')
    api_key = request.args.get('api_key')
    target_table  = request.args.get('target_table')

    cc = getCartoContext(user,api_key)
    data =getCartoData(cc,query)

    result = calcPCA(data.drop('orig_id',axis=1))
    result = result.assign(orig_id = data.orig_id)
    cc.write(result, target_table, overwrite=True, privacy='public')

    return result.to_json(orient='records')

@app.route('/mds')
def runMDS():
    user = request.args.get('user')
    query = request.args.get('query')
    api_key = request.args.get('api_key')
    target_table  = request.args.get('target_table')

    cc = getCartoContext(user,api_key)
    data =getCartoData(cc,query)

    result = calcMDS(data.drop('cartodb_id',axis=1))
    result = result.assign(orig_id = result.cartodb_id)
    cc.write(result, target_table, overwrite=True)

    return result.to_json(orient='records')


@app.route('/TSNE')
def runTSNE():

    user = request.args.get('user')
    query = request.args.get('query')
    api_key = request.args.get('api_key')
    target_table  = request.args.get('target_table')

    perplexity = int(request.args.get('perplexity'))
    iterations = int(request.args.get('iterations'))
    learning_rate= int(request.args.get('learning_rate'))

    cc = getCartoContext(user,api_key)
    data =getCartoData(cc,query)
    console_print('RUNNING WITH iterations: {} perplexity:{} learning_rate:{}'.format(iterations,perplexity,learning_rate))
    result = calcTSNEMulti(data.drop('orig_id',axis=1),iterations,perplexity,learning_rate)
    result = result.assign(orig_id = data.orig_id)
    cc.write(result, target_table, overwrite=True, privacy='public')

    return result.to_json(orient='records')

