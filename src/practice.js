require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

/*
const qry = knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where({ name: 'Point of view gun' })
  .first()
  .toQuery();
/*
  .then((result) => {
    console.log(result); 
 }); */

//console.log(qry);

const searchTerm = 'holo';

knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where('name', 'ILIKE', `%${searchTerm}%`)
  .then((result) => {
    console.log(result);
  });

function searchByProduceName(searchTerm) {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then((result) => {
      console.log(result);
    });
}

searchByProduceName('holo');

function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .limit(productsPerPage)
    .offset(offset)
    .then((result) => {
      console.log(result);
    });
}

paginateProducts(2);

function getProductsWithImages() {
  knexInstance
    .select('product_id', 'name', 'price', 'category', 'image')
    .from('amazong_products')
    .whereNotNull('image')
    .then((result) => {
      console.log(result);
    });
}

getProductsWithImages();

function mostPopularVideosForDays(days) {
  knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      { column: 'region', order: 'ASC' },
      { column: 'views', order: 'DESC' },
    ])
    .then((result) => {
      console.log(result);
    });
}

mostPopularVideosForDays(30);

function searchByItemName(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then((result) => {
      console.log('SEARCH TERM', { searchTerm });
      console.log(result);
    });
}

searchByItemName('urger');

function paginateItems(page) {
  const limit = 6;
  const offset = limit * (page - 1);
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(limit)
    .offset(offset)
    .then((result) => {
      console.log('PAGINATE ITEMS', { page });
      console.log(result);
    });
}

paginateItems(2);

function productsAddedDaysAgo(daysAgo) {
  knexInstance
    .select('id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
    )
    .then((results) => {
      console.log('PRODUCTS ADDED DAYS AGO');
      console.log(results);
    });
}

productsAddedDaysAgo(5);

function costPerCategory() {
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then((result) => {
      console.log('COST PER CATEGORY');
      console.log(result);
    });
}

costPerCategory();
