from flask import Flask, jsonify,request, make_response
import requests
from sklearn.manifold import TSNE, MDS
from sklearn.decomposition import PCA
from urllib.parse import urlencode
from shutil import rmtree
import pandas as pd
from io import StringIO
from bhtsne import init_bh_tsne,bh_tsne
from tempfile import mkdtemp
import subprocess
import sys
from io import StringIO
import concurrent.futures
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def console_print(message):
    print(message, file=sys.stderr)

def cartoQuery(query,user,api_key):
    params= {
        'q' : query,
        'api_key': api_key,
        'format': 'csv'
    }
    console_print("#############\n\n\n")
    console_print(query)
    console_print("#############\n\n\n")
    request_url = 'https://{}.carto.com/api/v2/sql?{}'.format(user,urlencode(params))
    return pd.read_csv(request_url)

def getCartoDataColumns(query,user,api_key):
    one_row_query = "select * from ({}) as a limit 1".format(query)
    one_row = cartoQuery(one_row_query,user, api_key)
    columns = one_row.drop(['the_geom','the_geom_webmercator'],axis=1).columns
    return columns

def getCartoData(query,user,api_key):
    columns = getCartoDataColumns(query,user,api_key)
    print(columns)
    data = cartoQuery("select {} from ({}) as a".format(','.join(columns),query), user, api_key )
    return data.fillna(0)

def calcPCA(data):
    pca = PCA(n_components=2)
    result = pca.fit_transform(data)
    return data.assign(x=result[:,0], y= result[:,1])

def calcTSNE(data):
    tmp_dir_path = mkdtemp()
    tmp_dir_path = '.'
    data.to_csv(tmp_dir_path+'/input.tsv',sep='\t')
    console_print('tmp path '+ tmp_dir_path)
    try:
        subprocess.check_call(['python','bhtsne.py'
                         '-d',str(data.shape[1]),
                         '-p',str(25),
                         '-i', tmp_dir_path+'input.tsv',
                         '-o', tmp_dir_path+'output.tsv',
                        ])
    except subprocess.CalledProcessError as e:
        console_print(e)

    result = pd.read_table(tmp_dir_path+'/output.tsv',sep='\t')
    rmtree(tmp_dir_path)
    return result
def calcTSNELocal(data):

    tmp_dir_path = mkdtemp()
    init_bh_tsne(data.as_matrix(),
                 tmp_dir_path,
                 no_dims=data.shape[1],
                 perplexity=25,
                 theta=0.5,
                 randseed=-1,
                 verbose=True,
                 initial_dims=50,
                 use_pca=True,
                 max_iter=1000)
    res = []
    for result in bh_tsne(tmp_dir_path, True):
        sample_res = []
        for r in result:
            sample_res.append(r)
        res.append(sample_res)
    rmtree(tmp_dir_path)
    # results  = bhtsne.run_bh_tsne(data.as_matrix(),
                        # initial_dims=data.shape[1],
                        # verbose=True,
                        # perplexity=25)
    results = np.array(res, dtype='float64')
    return data.assign(x=results[:,0], y= results[:,1])



def calcMDS(data):
    console_print("#### starting to run MDS #####")
    results = MDS().fit_transform(data)
    console_print("#### done MDS #####")
    return data.assign(x=results[:,0], y= results[:,1])

def csvString(df):
    s = StringIO()
    df.to_csv(s,index=False)
    return s.getvalue()

def normalizeData(data):
    return  (data - data.min())/(data.max()-data.min())

@app.route('/')
def home():
    return 'working'

@app.route('/PCA')
def runPCA():
    user = request.args.get('user')
    query = request.args.get('query')
    api_key = request.args.get('api_key')
    data = getCartoData(query,user,api_key)
    result = calcPCA(data.drop('cartodb_id',axis=1))
    return result.to_json(orient='records')

@app.route('/mds')
def runMDS():
    user = request.args.get('user')
    query = request.args.get('query')
    api_key = request.args.get('api_key')
    data = getCartoData(query,user,api_key)
    result = calcMDS(data.drop('cartodb_id',axis=1))
    return result.to_json(orient='records')


@app.route('/TSNE')
def runTSNE():

    console_print("\n\n\n\n\n########## STARTING TSNE ########")

    user = request.args.get('user')
    query = request.args.get('query')
    console_print("\n\n\n\n\n########## Inital query ########")
    console_print(query)
    console_print("########## Inital query ########\n\n\n")

    api_key = request.args.get('api_key')
    data = getCartoData(query,user,api_key)

    console_print("\n\n###### STARTING bh tsne ######\n\n")

    # with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    result = calcTSNE(data.drop('cartodb_id',axis=1))
    console_print("\n\n###### Done bh tsne ######\n\n")

    return result.to_json(orient='records')
