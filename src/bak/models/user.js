/* global window */
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { create, remove, update } from 'services/crud'
import * as usersService from 'services/users'
import { crudModelGenerator } from './common'

export default crudModelGenerator("user")
