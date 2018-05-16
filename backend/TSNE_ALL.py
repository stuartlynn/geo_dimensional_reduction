from MulticoreTSNE import MulticoreTSNE as TSNE
import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt
import cartoframes as cf

perplexites= range(0,50)
iterations = 2000
learning_rate = 200

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
    data = cc.query("select {}, cartodb_id as orig_id from ({}) a ".format( ','.join(list(columns)),query ))
    return data.fillna(0)

def calcTSNEMulti(data,iterations,perplexity,learning_rate):
    tsne = TSNE(n_jobs=4,
                perplexity=perplexity,
                n_iter=iterations,
                learning_rate= learning_rate)
    Y = tsne.fit_transform(data)
    return data.assign(x= Y[:,0], y = Y[:,1])

user = 'observatory'
api_key= '893a45cc8505dfffe26d94b3c160a6fc1b1da459',
query = """select cartodb_id, the_geom, the_geom_webmercator,
          asian_pop/total_pop as pc_asian,
          black_pop/total_pop as pc_black,
          white_pop/total_pop as pc_white,
          bachelors_degree/total_pop as pc_bachelors,
          median_income/ (select max(median_income) from dr_block_groups_demo) as median_income
          from dr_block_groups_demo_ny
          """

cc = getCartoContext(user,api_key)
data =getCartoData(cc,query)

for perpexity in perplexites:
    result = calcTSNEMulti(data.drop('orig_id',axis=1),iterations,perpexity,learning_rate)
    print('doing {}'.format(perpexity))
    plt.figure()
    plt.scatter(result.x,result.y, marker='.', s=1)
    plt.savefig("perprex_{}.png".format(perpexity))
