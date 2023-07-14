import { DataSource } from 'typeorm';

import {options} from './db-options';


const dataSource = new DataSource(options as any)

export default dataSource;
