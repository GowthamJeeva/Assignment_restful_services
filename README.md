# Assignment_Web_services

## Local Code Run

1. Pre-requisites
    1. Cassandra
    2. Node
    3. npm install -g pm2
2. do, npm install
3. in the CQLSH window of cassandra, copy paste in the cqlsh window the contents of cassandra_dml.txt (utils > db > cassandra > cassandra_dml.txt)
4. do, npm run pm2:start
5. do, pm2 list and pm2 log <id> to see the logs