import app
import bhtsne

query = """
select cartodb_id, the_geom, the_geom_webmercator,
          asian_pop/total_pop as pc_asian,
          black_pop/total_pop as pc_black,
          white_pop/total_pop as pc_white,
          bachelors_degree/total_pop as pc_bachelors,
          median_income/ (select max(median_income) from dr_block_groups_demo) as median_income
          from dr_block_groups_demo_ny

"""

# query = """
   # select vals.cartodb_id,geom.the_geom,
# geom.the_geom_webmercator,
# vals.total_pop,
# vals.bachelors_degree,
# vals.associates_degree,
# black_pop,
# white_pop,
# asian_pop,
# median_income
# from obs_fcd4e4f5610f6764973ef8c0c215b2e80bec8963 as geom,
# obs_b393b5b88c6adda634b2071a8005b03c551b609a as vals
# where geom.geoid=vals.geoid
# limit 100
# """

api_key = '893a45cc8505dfffe26d94b3c160a6fc1b1da459'
user = 'observatory'

data = app.getCartoData(query,user,api_key)
print(data)
print(data.shape)
result = bhtsne.run_bh_tsne(data.as_matrix(), initial_dims=data.shape[1], verbose=True, perplexity=25)
# result = app.calcTSNE(data)
data.assign(x=result[:,0], y= result[:,1]).to_csv('temp.csv', index=False)
