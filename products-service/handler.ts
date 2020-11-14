import 'source-map-support/register';
import {config} from 'dotenv';

import {getProductsById} from './handlers/getProductsById';
import {getProducts} from './handlers/getProducts';
import {createProduct} from './handlers/createProduct';

config();

export { getProductsById, getProducts, createProduct };
