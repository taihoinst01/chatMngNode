var dbConfig = require('./dbConfig');

var pool = null;
var appPool = null;
var rememberConfig = null;
module.exports = {

    getAppConnection : function (sql, appName) {
        if (rememberConfig === appName) {
            if (appPool) return appPool;
        } else {
            rememberConfig = appName;
        }

        //if (appPool) return appPool;
        var conn;//= new sql.ConnectionPool(dbConfig);

        switch (appName) {
            case 'autoway_luis_01':
                conn = new sql.ConnectionPool(dbConfig.autowayDbConfig);
                break;

            default :
                conn = new sql.ConnectionPool(dbConfig.dbConfig);
                break;
        }

        //override close behavior to eliminate the pool
        var close_conn = conn.close;
        conn.close = function(){
            appPool = null;
            close_conn.apply(conn, arguments);
        }

        return appPool = conn.connect()
            .then(function(){ return conn; })
            .catch(function(err){
                appPool = null;
                return Promise.reject(err);
            });
    },

    getConnection : function (sql) {

        /*
        var defaultdbConfig = {
            user: 'taihoinst',
            password: 'taiho9788!',
            server: 'taiholab.database.windows.net',
            database: 'chatMng',
            connectionTimeout : 30000,
            requestTimeout : 30000,
            options: {
                encrypt: true
            }
        };
        */
       if (pool) return pool;

       var conn = new sql.ConnectionPool(dbConfig.dbConfig);
        //var conn = new sql.ConnectionPool(defaultdbConfig);

        //override close behavior to eliminate the pool
        var close_conn = conn.close;
        conn.close = function(){
            pool = null;
            close_conn.apply(conn, arguments);
        }

        return pool = conn.connect()
            .then(function(){ return conn; })
            .catch(function(err){
                pool = null;
                return Promise.reject(err);
            });
    }      
}