#!/usr/bin/env node

// Dependencies
const uploadContent = require('../utils/uploadContent');
const config = require('../../config'); // eslint-disable-line import/no-unresolved

Object.keys(config.demo).forEach(uploadContent);
