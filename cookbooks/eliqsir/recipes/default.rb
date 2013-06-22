#
# Cookbook Name:: eliqsir
# Recipe:: default
#
# Copyright (C) 2013 YOUR_NAME
# 
# All rights reserved - Do Not Redistribute
#
node.default["nginx"]["default_site_enabled"] = false
include_recipe "nginx::source"

node.default["nodejs"]["version"] ='0.10.10' 
include_recipe "nodejs::install_from_source"


directory "/srv/www" do
    recursive true
end


if node.eliqsir.dev == false
    include_recipe "git::default"

    git "/srv/www/eliqsir" do
        repository "git://github.com/Grummle/eliqsir.git"
        reference "master"
        action :sync
    end
end

npm_package do
  path "/srv/www/eliqsir/src/server/"
  action :install_from_json
end

include_recipe "forever"
forever_service 'api' do
    path "/srv/www/eliqsir/src/server"
    script "server.js"
    action [:enable,:start]
end

template "/etc/nginx/sites-available/eliqsir" do
    notifies :reload, "service[nginx]", :delayed
end

link "/etc/nginx/sites-enabled/eliqsir" do
    to "/etc/nginx/sites-available/eliqsir"
end
