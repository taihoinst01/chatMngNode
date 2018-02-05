
var pool = null;
module.exports = {
    
    getConnection : function (sql) {

        var dbConfig = {
            user: 'taihoinst',
            password: 'taiho9788!',
            server: 'taiholab.database.windows.net',
            database: 'chatMng',
            options: {
                encrypt: true
            }
        };

        if (pool) return pool;
        var conn = new sql.ConnectionPool(dbConfig);

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