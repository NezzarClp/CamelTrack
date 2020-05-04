module.exports = class redisDAO {
    constructor(redisClient) {
        this._redisClient = redisClient;
    }

    keys(key) {
        return this._redisClient.keys(key);
    }

    smembers(key) {
        return this._redisClient.smembers(key);
    }

    sadd(key, value) {
        return this._redisClient.sadd(key, value);
    }

    hset(hash, key, value) {
        return this._redisClient.hset(hash, key, value);
    }

    hget(hash, key) {
        return this._redisClient.hget(hash, key);
    }

    scard(key) {
        return this._redisClient.scard(key);
    }
}

