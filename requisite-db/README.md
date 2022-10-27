https://www.pgadmin.org/docs/pgadmin4/development/import_export_servers.html

Export connections:
/venv/bin/python3 setup.py --dump-servers /tmp/output_file.json --user pgadmin@requisite.io

Import connections:
/path/to/python /path/to/setup.py --load-servers input_file.json --user user@example.com

docker ps -aqf "name=^containername$"

sudo docker ps -aqf "name=^requisite_db\."

export dbAdminId=$(sudo docker ps -aqf "name=^requisite_db-admin\.")
sudo docker exec -it $dbAdminId 'sh'
sudo docker exec -i $dbAdminId bash < mylocal.sh
