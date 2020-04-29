var config = require('../config');
var pgp = require('pg-promise')();
var db = pgp(config.getDbConnectionString());
const Pusher = require('pusher');
const pg = require ('pg');
module.exports = function (app) {
    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); 
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
        if (req.method == 'OPTIONS') {
          res.status(200).end();
        } else {
          next();
        }
      });
      const pool = new pg.Pool({
        connectionString: config.getDbConnectionString(),
      });
    
      var pusher = new Pusher({
        appId: '969447',
        key: 'bd5d7310044a12129c50',
        secret: 'a5f454ed8d0278957cd7',
        cluster: 'eu',
        encrypted: true
      });
    
      pool.connect((err, client) => {
        if(err) {
          console.log(err);
        }
        client.on('notification', function(msg) {
          pusher.trigger('watch_datasensor4','my-event', JSON.parse(msg.payload));
        });
        client.query('LISTEN watch_datasensor4');
      });
   
    
    app.get('/api/rooms', function (req, res) {
        db.any('SELECT DISTINCT room FROM controller_sensor')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            }).catch(err => {
                res.json({
                    description: "Cant find any room",
                    error: err
                });
            })
    });
    /*app.get('/api/dates', function (req, res) {
        db.any('SELECT DISTINCT to_char( date_time, \'yyyy/mm/dd\') as date FROM datasensor')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            }).catch(err => {
                res.json({
                    description: "Cant find any room",
                    error: err
                });
            })
    });*/
    app.get('/api/sensors', function (req, res) {
        db.any('SELECT DISTINCT sensorname FROM sensor')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            }).catch(err => {
                res.json({
                    description: "Cant find any room",
                    error: err
                });
            })
    });
    app.get('/api/controllers', function (req, res) {
        db.any('SELECT DISTINCT controllername FROM controller')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            }).catch(err => {
                res.json({
                    description: "Cant find any room",
                    error: err
                });
            })
    });

    app.get('/api/sensor/:id', function (req, res) {
        db.any('SELECT * FROM sensor WHERE id=' + req.params.id)
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            }).catch(err => {
                res.json({
                    description: "Cant find any sensor",
                    error: err
                });
            })
    });
    app.get('/api/sensorname/:name', function (req, res) {

        db.any('SELECT * FROM sensor WHERE sensorname LIKE \'%' + req.params.name + '%\'')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            }).catch(err => {
                res.json({
                    description: "Cant find any sensor",
                    error: err
                });
            })

    });



    app.get('/api/data/:date', function (req, res) {

        db.any('SELECT sensor.sensorname,controller.controllername,datasensor.data, typevalue.valuetype,typevalue.dimension,controller_sensor.room, to_char( date_time, \'yyyy/mm/dd\') AS date  FROM datasensor  INNER JOIN typevalue ON datasensor.id_typevalue=typevalue.id INNER JOIN controller_sensor ON datasensor.id_controllersensor=controller_sensor.id INNER JOIN sensor ON controller_sensor.id_sensor=sensor.id INNER JOIN controller ON controller_sensor.id_controller=controller.id WHERE date_time ::text LIKE \'%' + req.params.date + '%\'  limit 25')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            }).catch(err => {
                res.json({
                    description: "Cant find any data",
                    error: err
                });
            })

    });
    app.get('/api/room/:number/sensors/controllers', function (req, res) {
        db.any('SELECT sensor.sensorname controller_FROM sensor INNER JOIN controller_sensor ON controller_sensor.id_sensor=sensor.id WHERE controller_sensor.room=' + req.params.number + ':: varchar')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });
    app.get('/api/data/valuetype/:valuetype', function (req, res) {
        db.any('SELECT sensor.sensorname,controller.controllername,datasensor.data, typevalue.valuetype,typevalue.dimension,controller_sensor.room, to_char( date_time, \'yyyy/mm/dd\') AS date  FROM datasensor  INNER JOIN typevalue ON datasensor.id_typevalue=typevalue.id INNER JOIN controller_sensor ON datasensor.id_controllersensor=controller_sensor.id INNER JOIN sensor ON controller_sensor.id_sensor=sensor.id INNER JOIN controller ON controller_sensor.id_controller=controller.id WHERE typevalue.valuetype  LIKE \'%' + req.params.valuetype + '%\'  limit 25')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });
    app.get('/api/dimensions/valuetypes', function (req, res) {
        db.any('SELECT  valuetype,dimension  FROM typevalue')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });
    //dunaamiline valauetype by room
    
    app.get('/api/data/valuetypes/:room', function (req, res) {
        db.any('SELECT DISTINCT typevalue.valuetype  FROM datasensor  INNER JOIN typevalue ON datasensor.id_typevalue=typevalue.id INNER JOIN controller_sensor ON datasensor.id_controllersensor=controller_sensor.id  WHERE room=\''+req.params.room+'\'')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });
    
    app.get('/api/valuetypes', function (req, res) {
        db.any('SELECT  valuetype,dimension  FROM typevalue')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });
    //sensor room controller
    app.get('/api/controller/sensor/room/:room', function (req, res) {
        db.any('SELECT sensor.sensorname,controller.controllername,controller_sensor.room  FROM controller_sensor   INNER JOIN sensor ON controller_sensor.id_sensor=sensor.id INNER JOIN controller ON controller_sensor.id_controller=controller.id WHERE controller_sensor.room  LIKE \'%' + req.params.room + '%\'')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });
    app.get('/api/controller/sensor/room', function (req, res) {
        db.any('SELECT sensor.sensorname,controller.controllername,controller_sensor.room  FROM controller_sensor  INNER JOIN sensor ON controller_sensor.id_sensor=sensor.id INNER JOIN controller ON controller_sensor.id_controller=controller.id')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });
    app.get('/api/avaragedata', function (req, res) {
        db.any('SELECT  AVG(data) FROM datasensor INNER JOIN typevalue ON datasensor.id_typevalue=typevalue.id GROUP BY typevalue.valuetype;')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });
    
    app.get('/api/avaragedata/rooms/interval/hours/:hours', function (req, res) {
        db.any('SELECT	avgdata.dimension,avgdata.room,avgdata.valuetype,AVG(avgdata.data)FROM ( SELECT controller_sensor.room,datasensor.data,datasensor.date_time,typevalue.valuetype,typevalue.dimension FROM datasensor INNER JOIN typevalue ON datasensor.id_typevalue=typevalue.id 	INNER JOIN controller_sensor on datasensor.id_controllersensor=controller_sensor.id  WHERE datasensor.date_time >= current_timestamp  - interval \'' + req.params.hours + ' hours\') AS avgdata   GROUP BY avgdata.valuetype,avgdata.room ,avgdata.dimension')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            }).catch(err => {
                res.json({
                    description: "Cant find any data",
                    error: err
                });
            })
    });
    //adnmed diagrammi interval valitud päevad
    app.get('/api/data/room/interval/:start/:end', function (req, res) {

        db.any('SELECT sensor.sensorname,controller.controllername,datasensor.data, typevalue.valuetype,typevalue.dimension,controller_sensor.room, datasensor.date_time as date FROM datasensor  INNER JOIN typevalue ON datasensor.id_typevalue=typevalue.id INNER JOIN controller_sensor ON datasensor.id_controllersensor=controller_sensor.id INNER JOIN sensor ON controller_sensor.id_sensor=sensor.id INNER JOIN controller ON controller_sensor.id_controller=controller.id WHERE date_time BETWEEN \'' + req.params.start + '\' AND \'' + req.params.end + '\'')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            }).catch(err => {
                res.json({
                    description: "Cant find any data",
                    error: err
                });
            })

    });
    app.get('/api/data/:room/:day/:valuetype', function (req, res) {

        db.any('SELECT sensor.sensorname,controller.controllername,datasensor.data, typevalue.valuetype,typevalue.dimension,controller_sensor.room, datasensor.date_time as date FROM datasensor  INNER JOIN typevalue ON datasensor.id_typevalue=typevalue.id INNER JOIN controller_sensor ON datasensor.id_controllersensor=controller_sensor.id INNER JOIN sensor ON controller_sensor.id_sensor=sensor.id INNER JOIN controller ON controller_sensor.id_controller=controller.id WHERE date_time::date = \'' + req.params.day + '\' AND typevalue.valuetype=\'' + req.params.valuetype + '\' AND room =\'' + req.params.room + '\' ORDER BY date_time')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            }).catch(err => {
                res.json({
                    description: "Cant find any data",
                    error: err
                });
            })

    });
    
    app.get('/api/avaragedata/rooms/interval/months/:months', function (req, res) {
        db.any('SELECT	avgdata.date_time,avgdata.dimension,avgdata.room,avgdata.valuetype,AVG(avgdata.data)FROM ( SELECT controller_sensor.room,datasensor.data,datasensor.date_time,typevalue.valuetype,typevalue.dimension FROM datasensor INNER JOIN typevalue ON datasensor.id_typevalue=typevalue.id 	INNER JOIN controller_sensor on datasensor.id_controllersensor=controller_sensor.id  WHERE datasensor.date_time >= current_timestamp - interval \'' + req.params.months + ' months\') AS avgdata   GROUP BY avgdata.valuetype,avgdata.room ,avgdata.dimension,avgdata.date_time limit 20')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            }).catch(err => {
                res.json({
                    description: "Cant find any data",
                    error: err
                });
            })
    });
   
    app.get('/api/data/:valuetype/lessthan/:number', function (req, res) {
        db.any('SELECT sensor.sensorname,controller.controllername,datasensor.data, typevalue.valuetype,typevalue.dimension,controller_sensor.room, to_char( date_time, \'yyyy/mm/dd\') AS date  FROM datasensor  INNER JOIN typevalue ON datasensor.id_typevalue=typevalue.id INNER JOIN controller_sensor ON datasensor.id_controllersensor=controller_sensor.id INNER JOIN sensor ON controller_sensor.id_sensor=sensor.id INNER JOIN controller ON controller_sensor.id_controller=controller.id WHERE data <' + req.params.number + ' AND typevalue.valuetype LIKE  \'%' + req.params.valuetype + '%\' limit 25')
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });


}