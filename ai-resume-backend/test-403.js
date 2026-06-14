const express = require('express');
const request = require('supertest');
const app = require('./app');

request(app)
  .delete('/api/resume/dummy')
  .expect(401) // Because no token
  .end((err, res) => {
    console.log("No token status:", res.status);
    console.log("No token body:", res.body);
  });
