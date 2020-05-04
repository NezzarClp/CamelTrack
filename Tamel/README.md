# CamelCase

# Install instructions
## Clone project
git clone https://github.com/NezzarClp/CamelCase.git  
cd discordBot  

## Install node and node modules
apt-get install nvm  
nvm install 10  
nvm use 10  
yarn  

## Install python and python modules
apt-get install pip  
pip install GitPython  

## Install redis
cd ~  
wget http://download.redis.io/redis-stable.tar.gz  
tar xvzf redis-stable.tar.gz  
cd redis-stable  
make  
make install  
cd ..  
rm redis-stable.tar.gz  

## Setup config
cd config  
mkdir credientials  
vim index.js  
  
Insert config:  
```
module.exports = {
    discordBotToken: /* Discord bot token */
    pSQLDbConfig: {
        host: /* PSQL host */
        database: /* PSQL database */
        user: /* PSQL user */
        password: /* PSQL password */
    },
    redis: {
        host: /* Redis host */
        port: /* Redis port */
        password: /* Redis password */
    },
};
```
